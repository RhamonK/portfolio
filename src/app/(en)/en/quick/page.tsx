import { QuickPage } from "@/components/QuickPage";
import { site } from "@/data/site";
import { ui } from "@/i18n";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata(
  "en",
  { fr: "/rapide", en: "/en/quick" },
  { title: `${ui.en.quickTitle} — ${site.name}`, description: ui.en.quickDescription },
);

export default function Page() {
  return <QuickPage lang="en" />;
}
