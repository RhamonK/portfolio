import { MamaShopMockup } from "./MamaShopMockup";
import { AboMockup } from "./AboMockup";
import { ChichicutiesMockup } from "./ChichicutiesMockup";
import { NovariftMockup } from "./NovariftMockup";

/** Sélectionne le bon mockup selon le slug du projet. */
export function Mockup({ slug }: { slug: string }) {
  switch (slug) {
    case "mamashop":
      return <MamaShopMockup />;
    case "abo":
      return <AboMockup />;
    case "chichicuties":
      return <ChichicutiesMockup />;
    case "novarift":
      return <NovariftMockup />;
    default:
      return null;
  }
}
