import { ogImage, ogSize } from "@/components/OgImage";
import { siteCopy } from "@/data/site";

export const dynamic = "force-static";

export const alt = siteCopy.en.title;
export const size = ogSize;
export const contentType = "image/png";

export default function OgImage() {
  return ogImage("en");
}
