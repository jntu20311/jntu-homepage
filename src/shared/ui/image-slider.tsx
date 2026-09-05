import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/shared/lib/utils";

export interface SlideImage {
  src: string;
  alt: string;
}

interface ImageSliderProps {
  images: SlideImage[];
  /** 자동 전환 간격(ms). 0 이하이면 자동 전환을 사용하지 않습니다. */
  interval?: number;
  /** 페이드 전환 시간(ms) */
  duration?: number;
  className?: string;
}

export const ImageSlider = ({
  images,
  interval = 4000,
  duration = 700,
  className,
}: ImageSliderProps) => {
  const [current, setCurrent] = useState(0);
  const count = images.length;

  const goTo = useCallback((index: number) => {
    setCurrent(index);
  }, []);

  const prev = useCallback(
    () => setCurrent((c) => (c - 1 + count) % count),
    [count],
  );
  const next = useCallback(() => setCurrent((c) => (c + 1) % count), [count]);

  useEffect(() => {
    if (interval <= 0 || count <= 1) return;
    const timer = window.setInterval(
      () => setCurrent((c) => (c + 1) % count),
      interval,
    );
    return () => window.clearInterval(timer);
  }, [interval, count]);

  if (count === 0) return null;

  return (
    <div
      className={cn(
        // 1080 x 1350 = 4:5 비율
        "group relative mx-auto aspect-[4/5] w-full max-w-[1080px] overflow-hidden rounded-xl bg-muted",
        className,
      )}
      role="region"
      aria-roledescription="carousel"
      aria-label="이미지 슬라이더"
    >
      {images.map((image, index) => (
        <img
          key={image.src}
          src={image.src}
          alt={image.alt}
          aria-hidden={index !== current}
          className={cn(
            "absolute inset-0 h-full w-full object-cover transition-opacity ease-in-out motion-reduce:transition-none",
            index === current ? "opacity-100" : "opacity-0",
          )}
          style={{ transitionDuration: `${duration}ms` }}
        />
      ))}

      {count > 1 ? (
        <>
          <button
            type="button"
            onClick={prev}
            aria-label="이전 이미지"
            className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-background/70 p-2 text-foreground opacity-0 shadow-sm transition-opacity hover:bg-background focus-visible:opacity-100 group-hover:opacity-100"
          >
            <ChevronLeft className="size-5" />
          </button>
          <button
            type="button"
            onClick={next}
            aria-label="다음 이미지"
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-background/70 p-2 text-foreground opacity-0 shadow-sm transition-opacity hover:bg-background focus-visible:opacity-100 group-hover:opacity-100"
          >
            <ChevronRight className="size-5" />
          </button>

          <div className="absolute inset-x-0 bottom-4 flex items-center justify-center gap-2">
            {images.map((image, index) => (
              <button
                key={image.src}
                type="button"
                onClick={() => goTo(index)}
                aria-label={`${index + 1}번째 이미지로 이동`}
                aria-current={index === current}
                className={cn(
                  "h-2 rounded-full bg-background/60 transition-all",
                  index === current ? "w-6 bg-background" : "w-2",
                )}
              />
            ))}
          </div>
        </>
      ) : null}
    </div>
  );
};
