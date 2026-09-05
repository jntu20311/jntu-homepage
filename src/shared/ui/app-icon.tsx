import icon from "@/shared/assets/images/jntu-icon.png";
import { cn } from "../lib/utils";

type Props = {
  className?: string;
};

export const AppIcon = ({ className }: Props) => {
  return <img src={icon} className={cn("size-12", className)} />;
};
