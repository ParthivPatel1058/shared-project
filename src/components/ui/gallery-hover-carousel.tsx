import Reveal from "@/components/Reveal";
import ShinyText from "@/components/ui/shiny-text";
import MagicBento, { type BentoItem } from "@/components/ui/magic-bento";

export type GalleryHoverCarouselItem = BentoItem;

interface GalleryHoverGridProps {
  heading?: string;
  subheading?: string;
  items: BentoItem[];
}

/**
 * Feature showcase. Sits on a blurred scrim so the type keeps contrast
 * wherever the fixed scene behind it happens to be bright, and lays the
 * features out as a Magic Bento grid.
 */
export default function GalleryHoverGrid({
  heading = "Everything you need",
  subheading = "From seed to sale — explore every tool in one place.",
  items,
}: GalleryHoverGridProps) {
  return (
    <section className="section-scrim w-full rounded-[32px] p-6 md:p-10">
      <Reveal className="mb-8 max-w-2xl" blur distance={22}>
        <h2 className="font-serif-display text-3xl text-white sm:text-4xl lg:text-5xl">
          <ShinyText text={heading} speed={6} />
        </h2>
        <p className="mt-2 text-sm text-white/70 sm:text-base">{subheading}</p>
      </Reveal>

      <Reveal distance={34}>
        <MagicBento items={items} />
      </Reveal>
    </section>
  );
}
