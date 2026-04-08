import { memo, useState, useEffect, useRef, useCallback } from "react";
import { ChevronLeft, ChevronRight, Sun, Moon, Monitor } from "lucide-react";
import { getMonthName } from "@/utils/date";
import { getHeroImageForMonth, getAdjacentMonthImages } from "@/utils/heroImages";
import { useThemeFromImage } from "@/hooks/useThemeFromImage";
import { MonthPicker } from "./MonthPicker";

interface CalendarHeaderProps {
  year: number;
  month: number;
  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;
  onGoToMonth: (year: number, month: number) => void;
  theme: "light" | "dark" | "system";
  onThemeChange: (theme: "light" | "dark" | "system") => void;
}

const themeIcons = {
  light: Sun,
  dark: Moon,
  system: Monitor,
} as const;

const themeOrder: Array<"light" | "dark" | "system"> = ["light", "dark", "system"];

export const CalendarHeader = memo(function CalendarHeader({
  year,
  month,
  onPrev,
  onNext,
  onToday,
  onGoToMonth,
  theme,
  onThemeChange,
}: CalendarHeaderProps) {
  const currentImage = getHeroImageForMonth(month);
  const [displayedImage, setDisplayedImage] = useState(currentImage);
  const [nextImage, setNextImage] = useState<string | null>(null);
  const [transitioning, setTransitioning] = useState(false);
  const [monthPickerOpen, setMonthPickerOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useThemeFromImage(currentImage);

  useEffect(() => {
    const adjacent = getAdjacentMonthImages(month);
    adjacent.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, [month]);

  useEffect(() => {
    if (currentImage === displayedImage) return;
    setNextImage(currentImage);
    setTransitioning(true);
    const timer = setTimeout(() => {
      setDisplayedImage(currentImage);
      setNextImage(null);
      setTransitioning(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [currentImage, displayedImage]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!containerRef.current || window.innerWidth < 768) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    const imgs = containerRef.current.querySelectorAll<HTMLImageElement>("[data-hero-img]");
    imgs.forEach((img) => {
      img.style.transform = `scale(1.05) translate(${-x * 4}px, ${-y * 4}px)`;
    });
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (!containerRef.current) return;
    const imgs = containerRef.current.querySelectorAll<HTMLImageElement>("[data-hero-img]");
    imgs.forEach((img) => {
      img.style.transform = "scale(1.05) translate(0px, 0px)";
    });
  }, []);

  const cycleTheme = useCallback(() => {
    const idx = themeOrder.indexOf(theme);
    onThemeChange(themeOrder[(idx + 1) % themeOrder.length]);
  }, [theme, onThemeChange]);

  const ThemeIcon = themeIcons[theme];

  return (
    <div className="relative overflow-hidden rounded-t-xl">
      <div
        ref={containerRef}
        className="relative h-40 sm:h-48 overflow-hidden"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <img
          data-hero-img
          src={displayedImage}
          alt="Seasonal landscape"
          className="absolute inset-0 h-full w-full object-cover"
          style={{
            transform: "scale(1.05)",
            opacity: transitioning ? 0 : 1,
            transition: "transform 8000ms ease-linear, opacity 500ms ease-in-out",
          }}
          width={1920}
          height={512}
        />
        {nextImage && (
          <img
            data-hero-img
            src={nextImage}
            alt="Seasonal landscape"
            className="absolute inset-0 h-full w-full object-cover"
            style={{
              transform: "scale(1.05)",
              opacity: transitioning ? 1 : 0,
              transition: "opacity 500ms ease-in-out",
            }}
            width={1920}
            height={512}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 to-foreground/10" />
        <div className="relative flex h-full flex-col justify-end p-4 sm:p-6">
          <div className="flex items-end justify-between">
            <div>
              <button
                onClick={() => setMonthPickerOpen(true)}
                className="group text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-lg"
                aria-label="Open month picker"
              >
                <h1 className="text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl group-hover:opacity-80 calendar-transition">
                  {getMonthName(month)}
                </h1>
                <p className="mt-0.5 text-sm font-medium text-primary-foreground/80">
                  {year}
                </p>
              </button>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={cycleTheme}
                className="rounded-lg bg-primary-foreground/20 p-1.5 text-primary-foreground backdrop-blur-sm calendar-transition hover:bg-primary-foreground/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                aria-label={`Current theme: ${theme}. Click to cycle.`}
              >
                <ThemeIcon className="h-4 w-4" />
              </button>
              <button
                onClick={onToday}
                className="rounded-lg bg-primary-foreground/20 px-3 py-1.5 text-xs font-medium text-primary-foreground backdrop-blur-sm calendar-transition hover:bg-primary-foreground/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                aria-label="Go to today"
              >
                Today
              </button>
              <button
                onClick={onPrev}
                className="rounded-lg bg-primary-foreground/20 p-1.5 text-primary-foreground backdrop-blur-sm calendar-transition hover:bg-primary-foreground/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                aria-label="Previous month"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={onNext}
                className="rounded-lg bg-primary-foreground/20 p-1.5 text-primary-foreground backdrop-blur-sm calendar-transition hover:bg-primary-foreground/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                aria-label="Next month"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
      <MonthPicker
        year={year}
        month={month}
        open={monthPickerOpen}
        onClose={() => setMonthPickerOpen(false)}
        onSelect={onGoToMonth}
      />
    </div>
  );
});
