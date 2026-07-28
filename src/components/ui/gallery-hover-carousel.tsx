import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import Reveal from "@/components/Reveal";
import SpotlightCard from "@/components/ui/spotlight-card";
import ShinyText from "@/components/ui/shiny-text";
import { Card } from "@/components/ui/card";

export interface GalleryHoverCarouselItem {
  id: string;
  title: string;
  summary: string;
  url: string;
  image: string;
}

interface GalleryHoverGridProps {
  heading?: string;
  subheading?: string;
  items: GalleryHoverCarouselItem[];
}

function HoverCard({ item }: { item: GalleryHoverCarouselItem }) {
  return (
    <Link to={item.url} className="group block relative w-full h-[280px] md:h-[320px]">
      <SpotlightCard className="h-full w-full rounded-3xl">
        <Card className="lift img-zoom relative h-full w-full overflow-hidden rounded-3xl border-white/15 bg-white/5 backdrop-blur-xl">
          <img
            src={item.image}
            alt={item.title}
            loading="lazy"
            className="h-full w-full object-cover object-center"
          />

          {/* Always-on legibility gradient */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />

          {/* Copy */}
          <div className="absolute inset-x-0 bottom-0 z-10 p-5">
            <div className="flex items-end justify-between gap-3">
              <div className="min-w-0">
                <h3
                  className="truncate text-lg font-medium text-white md:text-xl"
                  style={{ fontFamily: "var(--font-serif)" }}
                >
                  {item.title}
                </h3>
                {/* Summary slides up on hover */}
                <p className="mt-1 max-h-0 overflow-hidden text-sm leading-relaxed text-white/75 opacity-0 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:max-h-24 group-hover:opacity-100">
                  {item.summary}
                </p>
              </div>

              <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border border-white/30 bg-white/10 text-white backdrop-blur-md transition-all duration-500 group-hover:rotate-45 group-hover:border-white/60 group-hover:bg-white group-hover:text-neutral-900">
                <ArrowUpRight className="h-4 w-4" strokeWidth={2} />
              </span>
            </div>
          </div>
        </Card>
      </SpotlightCard>
    </Link>
  );
}

/**
 * Feature gallery: a responsive grid (3x3 on desktop) of spotlight cards.
 * Sits on a scrim so the type stays legible wherever the fixed scene behind
 * it happens to be bright.
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

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item, i) => (
          <Reveal key={item.id} delay={(i % 3) * 0.08} distance={34}>
            <HoverCard item={item} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
