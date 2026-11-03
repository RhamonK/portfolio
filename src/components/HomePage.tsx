import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { ProjectRoom } from "@/components/ProjectRoom";
import { Parcours } from "@/components/Parcours";
import { Expertise } from "@/components/Expertise";
import { Lab } from "@/components/Lab";
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
        <ProjectRoom lang={lang} />
        <Expertise lang={lang} />
        <Lab lang={lang} />
        <Parcours lang={lang} />
        <Contact lang={lang} />
      </main>
      <Footer />
      <CvPill lang={lang} />
      <InfiniteThread lang={lang} />
    </>
  );
}
