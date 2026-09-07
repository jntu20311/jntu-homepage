import { ArrowRightIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { HomeLink } from "../model/types";

type Props = {
  data: HomeLink;
};

export const HomeLinkCard = ({ data }: Props) => {
  return (
    <Link to={data.link} key={`homelink-${data}`}>
      <div className="aspect-[1/1] flex flex-col items-center justify-center rounded-4xl border py-4 hover:bg-gray-100 gap-2">
        <span className="text-3xl font-semibold">{data.label}</span>
        <span className="text-md flex items-center border rounded-md px-3 py-1 gap-1">
          {"바로가기"}
          <ArrowRightIcon size={16} />
        </span>
      </div>
    </Link>
  );
};
