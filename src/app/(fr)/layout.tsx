import { RootShell } from "@/components/RootShell";
import { pageMetadata } from "@/lib/metadata";

export { viewport } from "@/lib/metadata";
export const metadata = pageMetadata("fr", { fr: "/", en: "/en" });

export default function Layout({ children }: { children: React.ReactNode }) {
  return <RootShell lang="fr">{children}</RootShell>;
}
