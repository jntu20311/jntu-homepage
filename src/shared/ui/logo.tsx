import LogoImage from "@/shared/assets/images/logo.png";
import { cn } from "../lib/utils";

type Props = {
  className?: string;
};

export const Logo = ({ className }: Props) => {
  return <img src={LogoImage} className={cn("w-70", className)} />;
};
