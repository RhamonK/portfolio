import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { ProjectRoom } from "@/components/ProjectRoom";
import { Parcours } from "@/components/Parcours";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main id="contenu">
        <Hero />
        <ProjectRoom />
        <Parcours />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
