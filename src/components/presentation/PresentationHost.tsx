"use client";

// Chargé à la demande (au clic sur « Lancer la présentation ») : le composant de
// présentation et le texte des présentations ne pèsent pas sur le premier affichage.
import type { ComponentProps } from "react";
import { Presentation } from "@/components/presentation/Presentation";
import { presentations } from "@/data/presentations";

type Props = Omit<ComponentProps<typeof Presentation>, "presentation"> & { slug: string };

export default function PresentationHost({ slug, ...props }: Props) {
  const presentation = presentations[slug];
  if (!presentation) return null;
  return <Presentation presentation={presentation} {...props} />;
}
