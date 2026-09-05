import { CONSTANTS } from "@/shared/configs/constants";
import { PageHeader } from "@/shared/ui/page-header";

export const LocationPage = () => {
  return (
    <div>
      <PageHeader title="오시는길" description="찾아오시는 길을 안내합니다." />
      <div className="flex w-full items-center justify-center text-white text-3xl font-bold bg-blue-600 aspect-[2/1] whitespace-pre-wrap">
        {"지도 들어갈 자리\n(2:1 비율)"}
      </div>
      <div> {`우편번호 : ${CONSTANTS.POSTCODE}`}</div>
      <div>{CONSTANTS.ADDRESS}</div>
      <div>{CONSTANTS.TEL}</div>
    </div>
  );
};
