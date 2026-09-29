import { Link } from "react-router-dom";
import JoinSupporterImage from "@/shared/assets/images/img_join_supporter.png";
import { CONSTANTS } from "@/shared/configs/constants";

export const JoinSupporterPage = () => {
  return (
    <div>
      <header className="sm:flex sm:items-end gap-2 mb-4">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          후원회원 가입
        </h1>
        <h3 className="text-lg sm:text-xl text-muted-foreground/80 font-semibold">
          (이미지를 클릭하면 해당 페이지로 이동합니다.)
        </h3>
      </header>
      <Link to={CONSTANTS.JOIN_LINK} target="_blank">
        <img src={JoinSupporterImage} className="w-full" />
      </Link>
    </div>
  );
};
