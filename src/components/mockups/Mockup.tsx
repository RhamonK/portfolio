import { MamaShopMockup } from "./MamaShopMockup";
import { AboMockup } from "./AboMockup";
import { CutiesChichiMockup } from "./CutiesChichiMockup";
import { KelthenMockup } from "./KelthenMockup";
import { AuraMockup } from "./AuraMockup";
import { AgentFinancierMockup } from "./AgentFinancierMockup";
import { ProspectionMockup } from "./ProspectionMockup";

/** Sélectionne le bon mockup selon le slug du projet. */
export function Mockup({ slug }: { slug: string }) {
  switch (slug) {
    case "mamashop":
      return <MamaShopMockup />;
    case "abo":
      return <AboMockup />;
    case "cutieschichi":
      return <CutiesChichiMockup />;
    case "kelthen":
      return <KelthenMockup />;
    case "aura":
      return <AuraMockup />;
    case "agent-financier":
      return <AgentFinancierMockup />;
    case "kelthen-prospection":
      return <ProspectionMockup />;
    default:
      return null;
  }
}
