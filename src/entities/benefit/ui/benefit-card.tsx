import { Link } from "react-router-dom";
import { benefitDetailPath } from "@/shared/configs/routes";
import { formatDate } from "@/shared/lib/format";
import type { Benefit } from "../model/types";

interface BenefitCardProps {
  benefit: Benefit;
}

export const BenefitCard = ({ benefit }: BenefitCardProps) => {
  return (
    <Link
      to={benefitDetailPath(benefit.id)}
      className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-shadow hover:shadow-md"
    >
      <div className="aspect-[1/1] w-full overflow-hidden bg-muted">
        <img
          src={benefit.image}
          alt={benefit.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="line-clamp-2 font-semibold leading-snug text-card-foreground">
          {benefit.title}
        </h3>
        <time
          dateTime={benefit.createdAt}
          className="mt-auto text-sm text-muted-foreground"
        >
          {formatDate(benefit.createdAt)}
        </time>
      </div>
    </Link>
  );
};
