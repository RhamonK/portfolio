// Exported HTML carries its own script hashes. Unlike a generated vercel.json,
// these policies are part of the build output and work on any static host.
import { createHash } from "node:crypto";
import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const output = path.resolve("out");
const marker = /<meta\s+http-equiv="Content-Security-Policy"\s+content="[^"]*"\s*\/?\s*>/gi;

async function secureDirectory(directory) {
  let count = 0;
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      count += await secureDirectory(file);
      continue;
    }
    if (!entry.isFile() || !entry.name.endsWith(".html")) continue;

    const html = (await readFile(file, "utf8")).replace(marker, "");
    if (!/<head(?:\s[^>]*)?>/i.test(html)) throw new Error(`Missing head: ${file}`);
    const hashes = new Set();
    for (const match of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script\s*>/gi)) {
      if (/\bsrc\s*=/i.test(match[1]) || !match[2]) continue;
      hashes.add(`'sha256-${createHash("sha256").update(match[2]).digest("base64")}'`);
    }
    const policy = [
      "default-src 'self'",
      `script-src 'self' 'wasm-unsafe-eval' ${[...hashes].join(" ")}`,
      "script-src-attr 'none'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob:",
      "font-src 'self'",
      "media-src 'self' blob:",
      "connect-src 'self' blob: data:",
      "worker-src 'self' blob:",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "upgrade-insecure-requests",
    ].join("; ");
    // Keep this before any resource or script. frame-ancestors is enforced by
    // the HTTP header because browsers ignore that directive in meta policies.
    await writeFile(file, html.replace(/<head(?:\s[^>]*)?>/i, (head) => `${head}<meta http-equiv="Content-Security-Policy" content="${policy}">`));
    count++;
  }
  return count;
}

const count = await secureDirectory(output);
if (!count) throw new Error("No exported HTML found; refusing an unsecured build.");
console.log(`CSP hashes applied to ${count} exported HTML pages.`);
