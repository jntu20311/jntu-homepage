import { cn } from "../lib/utils";
import { useAverageColor } from "../model/useAverageColor";

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

  return (
    <div
      className={cn(
        "relative aspect-[1080/1350] w-full overflow-hidden",
        // "transition-colors duration-500",
        className,
      )}
      style={{ backgroundColor: bgColor, transitionDuration: `${duration}ms` }}
    >
      <img
        src={src}
        alt={alt}
        className="h-full w-full object-contain object-center transition-transform duration-300 group-hover:scale-105"
      />
    </div>
  );
}
