import { useState } from "react";
import { cn } from "../lib/utils";
import { useAverageColor } from "../model/useAverageColor";
import NoImage from "@/shared/assets/images/no_image.png";

interface AutoColorContainerProps {
  src: string;
  alt: string;
  className?: string;
  duration?: number;
}

export default function AutoColorContainer({
  src,
  alt,
  className = "",
  duration,
}: AutoColorContainerProps) {
  const bgColor = useAverageColor(src);
  const [errored, setErrored] = useState(false);

  // src 가 비었거나(썸네일 없음) 로드에 실패하면 기본 로고를 폴백으로 노출.
  const isFallback = errored || src === "";

  return (
    <div
      className={cn(
        "relative aspect-[1080/1350] w-full overflow-hidden",
        isFallback && "flex items-center justify-center bg-muted",
        className,
      )}
      style={
        isFallback
          ? undefined
          : { backgroundColor: bgColor, transitionDuration: `${duration}ms` }
      }
    >
      {isFallback ? (
        // 가로로 긴 로고를 세로 프레임 중앙에 폭 기준으로 축소 배치 (원본 비율 유지).
        <img src={NoImage} alt={alt || "전남교사노동조합"} />
      ) : (
        <img
          src={src}
          alt={alt}
          className="h-full w-full object-contain object-center transition-transform duration-300 group-hover:scale-105"
          onError={() => setErrored(true)}
        />
      )}
    </div>
  );
}
