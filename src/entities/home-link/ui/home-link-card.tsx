import { ArrowRightIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/shared/lib/utils";
import { HomeLink } from "../model/types";

type Props = {
  data: HomeLink;
};

const cardClassName =
  "group flex aspect-square h-full flex-col items-center justify-center gap-3 rounded-3xl border border-border bg-card p-4 text-center transition-all hover:border-primary hover:bg-primary/5 hover:shadow-md";

const content = (label: string) => (
  <>
    <span className="text-2xl font-bold text-foreground md:text-3xl">
      {label}
    </span>
    <span className="inline-flex items-center gap-1 rounded-full border border-primary px-4 py-1.5 text-sm font-semibold text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
      바로가기
      <ArrowRightIcon
        size={16}
        className="transition-transform group-hover:translate-x-0.5"
      />
    </span>
  </>
);

export const HomeLinkCard = ({ data }: Props) => {
  if (data.external) {
    return (
      <a
        href={data.link}
        target="_blank"
        rel="noreferrer"
        className={cn(cardClassName)}
      >
        {content(data.label)}
      </a>
    );
  }

  return (
    <Link to={data.link} className={cn(cardClassName)}>
      {content(data.label)}
    </Link>
  );
};
