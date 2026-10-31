import { QuickPage } from "@/components/QuickPage";
import { site } from "@/data/site";
import { ui } from "@/i18n";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata(
  "fr",
  { fr: "/rapide", en: "/en/quick" },
  { title: `${ui.fr.quickTitle} — ${site.name}`, description: ui.fr.quickDescription },
);

export default function Page() {
  return <QuickPage lang="fr" />;
}
