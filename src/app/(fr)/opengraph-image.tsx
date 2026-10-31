import { ogImage, ogSize } from "@/components/OgImage";
import { siteCopy } from "@/data/site";

export const alt = siteCopy.fr.title;
export const size = ogSize;
export const contentType = "image/png";

export default function OgImage() {
  return ogImage("fr");
}
