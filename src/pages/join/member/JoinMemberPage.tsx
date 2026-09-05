import JntuJoinImage from "@/shared/assets/images/img_jntu_join.png";
import { Link } from "react-router-dom";

export const JoinMemberPage = () => {
  return (
    <div>
      <header className="flex items-center gap-2 mb-4">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          조합원 가입
        </h1>
      </header>
      <img src={JntuJoinImage} className="hidden w-full flex mt-4" />

      <Link to={"https://www.naver.com/"} target="_blank">
        <div className="flex w-full items-center justify-center text-white text-3xl font-bold bg-green-600 h-200">
          {"조합원 가입 관련 이미지 \n(클릭시 네이버로 이동)"}
        </div>
      </Link>

      <Link to={"https://www.google.com/"} target="_blank">
        <div className="flex w-full items-center justify-center text-white text-3xl font-bold bg-blue-600 h-200">
          {"조합원 가입 관련 이미지2 \n(클릭시 구글로 이동)"}
        </div>
      </Link>
    </div>
  );
};
