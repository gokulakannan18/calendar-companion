import { useEffect, useRef, useCallback } from "react";

interface RGB {
  r: number;
  g: number;
  b: number;
}

interface HSL {
  h: number;
  s: number;
  l: number;
}

function rgbToHsl({ r, g, b }: RGB): HSL {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

function extractDominantColor(img: HTMLImageElement): RGB | null {
  try {
    const canvas = document.createElement("canvas");
    const size = 64;
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return null;

    ctx.drawImage(img, 0, 0, size, size);
    const data = ctx.getImageData(0, 0, size, size).data;

    let rSum = 0, gSum = 0, bSum = 0, count = 0;

    for (let i = 0; i < data.length; i += 16) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const sat = Math.max(r, g, b) - Math.min(r, g, b);
      if (sat > 30) {
        rSum += r;
        gSum += g;
        bSum += b;
        count++;
      }
    }

    if (count === 0) return { r: 180, g: 120, b: 60 };

    return {
      r: Math.round(rSum / count),
      g: Math.round(gSum / count),
      b: Math.round(bSum / count),
    };
  } catch {
    return null;
  }
}

const DEFAULT_PRIMARY: HSL = { h: 24, s: 70, l: 45 };

function clampForAccessibility(hsl: HSL): HSL {
  return {
    h: hsl.h,
    s: Math.max(40, Math.min(80, hsl.s)),
    l: Math.max(30, Math.min(55, hsl.l)),
  };
}

export function useThemeFromImage(imageSrc: string) {
  const prevSrc = useRef<string>("");

  const applyTheme = useCallback((hsl: HSL) => {
    const root = document.documentElement;
    const primary = clampForAccessibility(hsl);
    root.style.setProperty("--primary", `${primary.h} ${primary.s}% ${primary.l}%`);
    root.style.setProperty("--ring", `${primary.h} ${primary.s}% ${primary.l}%`);

    const rangeL = root.classList.contains("dark") ? 18 : 94;
    const rangeFgL = root.classList.contains("dark") ? 70 : 30;
    root.style.setProperty("--range", `${primary.h} 80% ${rangeL}%`);
    root.style.setProperty("--range-foreground", `${primary.h} 50% ${rangeFgL}%`);
    root.style.setProperty("--today", `${primary.h} ${primary.s}% ${primary.l}%`);
  }, []);

  useEffect(() => {
    if (imageSrc === prevSrc.current) return;
    prevSrc.current = imageSrc;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const rgb = extractDominantColor(img);
      if (rgb) {
        const hsl = rgbToHsl(rgb);
        applyTheme(hsl);
      } else {
        applyTheme(DEFAULT_PRIMARY);
      }
    };
    img.onerror = () => applyTheme(DEFAULT_PRIMARY);
    img.src = imageSrc;
  }, [imageSrc, applyTheme]);
}
