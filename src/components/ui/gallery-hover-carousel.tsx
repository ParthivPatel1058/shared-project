import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";

export interface GalleryHoverCarouselItem {
  id: string;
  title: string;
  summary: string;
  url: string;
  image: string;
}

interface GalleryHoverCarouselProps {
  heading?: string;
  subheading?: string;
  items: GalleryHoverCarouselItem[];
}

export default function GalleryHoverCarousel({
  heading = "Everything you need",
  subheading = "From seed to sale — explore every tool in one place.",
  items,
}: GalleryHoverCarouselProps) {
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  useEffect(() => {
    if (!carouselApi) return;
    const update = () => {
      setCanScrollPrev(carouselApi.canScrollPrev());
      setCanScrollNext(carouselApi.canScrollNext());
    };
    update();
    carouselApi.on("select", update);
    carouselApi.on("reInit", update);
    return () => {
      carouselApi.off("select", update);
      carouselApi.off("reInit", update);
    };
  }, [carouselApi]);

  return (
    <section className="w-full">
      <div className="mb-8 flex flex-col justify-between md:mb-12 md:flex-row md:items-end">
        <div className="max-w-2xl">
          <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground leading-tight">
            {heading}
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base mt-2">{subheading}</p>
        </div>
        <div className="flex gap-2 mt-5 md:mt-0">
          <Button
            variant="outline"
            size="icon"
            onClick={() => carouselApi?.scrollPrev()}
            disabled={!canScrollPrev}
            className="h-10 w-10 rounded-full"
            aria-label="Previous"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => carouselApi?.scrollNext()}
            disabled={!canScrollNext}
            className="h-10 w-10 rounded-full"
            aria-label="Next"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="w-full max-w-full">
        <Carousel
          setApi={setCarouselApi}
          opts={{ breakpoints: { "(max-width: 768px)": { dragFree: true } } }}
          className="relative w-full max-w-full"
        >
          <CarouselContent className="w-full max-w-full">
            {items.map((item) => (
              <CarouselItem key={item.id} className="basis-[280px] md:basis-[340px]">
                <Link to={item.url} className="group block relative w-full h-[300px] md:h-[360px]">
                  <Card className="overflow-hidden rounded-3xl h-full w-full border-white/12 bg-card/60 backdrop-blur-xl">
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
                      <h3 className="font-display text-lg md:text-xl font-semibold text-foreground">
                        {item.title}
                      </h3>
                      <p className="text-muted-foreground text-sm md:text-base line-clamp-2 mt-1">
                        {item.summary}
                      </p>
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
                      <h3 className="font-display text-base md:text-lg font-semibold text-white">
                        {item.title}
                      </h3>
                    </div>
                  </Card>
                </Link>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </section>
  );
}
