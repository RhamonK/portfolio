import { test } from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { mkdtemp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const script = fileURLToPath(new URL("./secure-export.mjs", import.meta.url));

test("export policies authorize exact inline scripts on every page, and are idempotent", async () => {
  const root = await mkdtemp(path.join(tmpdir(), "portfolio-csp-"));
  try {
    await mkdir(path.join(root, "out/en"), { recursive: true });
    const code = 'self.__next_f.push([1,"hello"]);';
    const html = `<html><head><script src="/init.js"></script></head><body><script>${code}</script></body></html>`;
    for (const name of ["index.html", "en/quick.html", "404.html"]) {
      await writeFile(path.join(root, "out", name), html);
    }
    const run = () => spawnSync(process.execPath, [script], { cwd: root, encoding: "utf8" });
    assert.equal(run().status, 0);
    const expected = createHash("sha256").update(code).digest("base64");
    for (const name of ["index.html", "en/quick.html", "404.html"]) {
      const result = await readFile(path.join(root, "out", name), "utf8");
      assert.match(result, new RegExp(`sha256-${expected.replace(/[+]/g, "\\+")}`));
      assert.match(result, /<head><meta http-equiv="Content-Security-Policy"/);
      assert.match(result, /script-src-attr 'none'/);
      assert.doesNotMatch(result.match(/script-src [^;]+/)[0], /'unsafe-inline'|'unsafe-eval'/);
      assert.ok(result.includes(`<script>${code}</script>`));
    }
    const first = await readFile(path.join(root, "out/index.html"), "utf8");
    assert.equal(run().status, 0);
    assert.equal(await readFile(path.join(root, "out/index.html"), "utf8"), first);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test("a missing or malformed export fails the build", async () => {
  const root = await mkdtemp(path.join(tmpdir(), "portfolio-csp-"));
  try {
    const run = () => spawnSync(process.execPath, [script], { cwd: root, encoding: "utf8" });
    assert.notEqual(run().status, 0);
    await mkdir(path.join(root, "out"));
    assert.notEqual(run().status, 0);
    await writeFile(path.join(root, "out/index.html"), "<html><body>missing head</body></html>");
    assert.notEqual(run().status, 0);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
