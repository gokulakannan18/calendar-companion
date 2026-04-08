import heroSpring from "@/assets/hero-spring.jpg";
import heroSummer from "@/assets/hero-summer.jpg";
import heroAutumn from "@/assets/hero-autumn.jpg";
import heroWinter from "@/assets/hero-winter.jpg";

const seasonImages = [heroWinter, heroWinter, heroSpring, heroSpring, heroSpring, heroSummer, heroSummer, heroSummer, heroAutumn, heroAutumn, heroAutumn, heroWinter] as const;

export function getHeroImageForMonth(month: number): string {
  return seasonImages[month] ?? heroSpring;
}

export function preloadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

export function getAdjacentMonthImages(month: number): string[] {
  const prev = month === 0 ? 11 : month - 1;
  const next = month === 11 ? 0 : month + 1;
  return [getHeroImageForMonth(prev), getHeroImageForMonth(next)];
}
