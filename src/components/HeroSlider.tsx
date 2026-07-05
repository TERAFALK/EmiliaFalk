"use client";

import { useEffect, useState } from "react";

/**
 * Hero-sektion med korsblandande bakgrundsbilder (slider) och innehåll ovanpå.
 * Håller den ljusa, rena looken via ett vitt/rosa lager över bilderna.
 */
export default function HeroSlider({
  images,
  intervalMs = 6000,
  children,
}: {
  images: string[];
  intervalMs?: number;
  children: React.ReactNode;
}) {
  const [index, setIndex] = useState(0);
  const hasImages = images.length > 0;

  useEffect(() => {
    if (images.length <= 1) return;
    const id = setInterval(
      () => setIndex((i) => (i + 1) % images.length),
      intervalMs
    );
    return () => clearInterval(id);
  }, [images.length, intervalMs]);

  return (
    <section className="relative overflow-hidden border-b border-pink-100">
      {/* Bakgrundsbilder */}
      {hasImages && (
        <div className="absolute inset-0" aria-hidden>
          {images.map((src, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={src}
              src={src}
              alt=""
              className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ease-in-out ${
                i === index ? "opacity-100" : "opacity-0"
              }`}
            />
          ))}
        </div>
      )}

      {/* Vitt/rosa lager för läsbarhet och ren look */}
      <div
        className="absolute inset-0"
        aria-hidden
        style={{
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.82) 0%, rgba(255,255,255,0.72) 55%, rgba(255,240,247,0.9) 100%)",
        }}
      />
      <div className="hero-gradient absolute inset-0" aria-hidden />

      {/* Innehåll */}
      <div className="relative">{children}</div>

      {/* Prickindikatorer */}
      {images.length > 1 && (
        <div className="absolute bottom-5 left-1/2 z-10 flex -translate-x-1/2 gap-2">
          {images.map((src, i) => (
            <button
              key={src}
              onClick={() => setIndex(i)}
              aria-label={`Bild ${i + 1}`}
              className={`h-2 rounded-full transition-all ${
                i === index ? "w-6 bg-pink-500" : "w-2 bg-pink-300/70 hover:bg-pink-400"
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
