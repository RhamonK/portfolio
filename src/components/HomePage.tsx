import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Brief } from "@/components/Brief";
import { ProjectRoom } from "@/components/ProjectRoom";
import { Expertise } from "@/components/Expertise";
import { Stack } from "@/components/Stack";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { CvPill } from "@/components/CvPill";
import { InfiniteThread } from "@/components/InfiniteThread";
import type { Lang } from "@/i18n";

export function HomePage({ lang }: { lang: Lang }) {
  return (
    <>
      <Header lang={lang} />
      <main id="contenu">
        <Hero lang={lang} />
        <Brief lang={lang} />
        <ProjectRoom lang={lang} />
        <Stack lang={lang} />
        <Expertise lang={lang} />
        <Contact lang={lang} />
      </main>
      <Footer />
      <CvPill lang={lang} />
      <InfiniteThread lang={lang} />
    </>
  );
}
