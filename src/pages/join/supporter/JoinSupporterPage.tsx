import { Link } from "react-router-dom";
import JoinSupporterImage from "@/shared/assets/images/img_join_supporter.png";
import { CONSTANTS } from "@/shared/configs/constants";

export const JoinSupporterPage = () => {
  return (
    <div>
      <header className="flex items-center gap-2 mb-4">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          후원회원 가입
        </h1>
      </header>
      <Link to={CONSTANTS.JOIN_LINK} target="_blank">
        <img src={JoinSupporterImage} className="w-full" />
      </Link>
    </div>
  );
};
