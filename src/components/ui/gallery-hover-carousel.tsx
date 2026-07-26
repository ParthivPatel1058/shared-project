import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

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
      <Card className="overflow-hidden rounded-3xl h-full w-full border-border bg-card/70 backdrop-blur-xl">
        {/* Image */}
        <div className="relative h-full w-full transition-all duration-500 group-hover:h-1/2">
          <img
            src={item.image}
            alt={item.title}
            loading="lazy"
            className="h-full w-full object-cover object-center"
          />
          <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </div>

        {/* Text (revealed on hover) */}
        <div className="absolute bottom-0 left-0 w-full px-4 py-3 transition-all duration-500 group-hover:h-1/2 group-hover:flex flex-col justify-center bg-background/95 backdrop-blur-sm opacity-0 group-hover:opacity-100">
          <h3 className="font-display text-lg md:text-xl font-semibold text-foreground">{item.title}</h3>
          <p className="text-muted-foreground text-sm line-clamp-2 mt-1">{item.summary}</p>
          <Button
            variant="outline"
            size="icon"
            className="absolute bottom-3 right-3 rounded-full hover:-rotate-45 transition-all duration-500 text-primary"
            aria-label={`Open ${item.title}`}
          >
            <ArrowRight className="size-4" />
          </Button>
        </div>

        {/* Idle title strip (before hover) */}
        <div className="absolute bottom-0 left-0 w-full px-4 py-3 bg-gradient-to-t from-black/75 to-transparent transition-opacity duration-500 group-hover:opacity-0">
          <h3 className="font-display text-base md:text-lg font-semibold text-white">{item.title}</h3>
        </div>
      </Card>
    </Link>
  );
}

/**
 * Hover-reveal feature gallery laid out as a responsive grid (3×3 on large
 * screens). On hover a card's image shrinks to the top half and the summary
 * slides up in the bottom half.
 */
export default function GalleryHoverGrid({
  heading = "Everything you need",
  subheading = "From seed to sale — explore every tool in one place.",
  items,
}: GalleryHoverGridProps) {
  return (
    <section className="w-full">
      <div className="mb-8 max-w-2xl">
        <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground leading-tight">
          {heading}
        </h2>
        <p className="text-muted-foreground text-sm sm:text-base mt-2">{subheading}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {items.map((item) => (
          <HoverCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}
