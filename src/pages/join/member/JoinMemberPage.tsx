import JntuJoinImage from "@/shared/assets/images/img_jntu_join.png";

export const JoinMemberPage = () => {
  return (
    <div>
      <header className="flex items-center gap-2">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          조합원 가입
        </h1>
      </header>
      <img src={JntuJoinImage} className="w-full flex mt-4" />
    </div>
  );
};
