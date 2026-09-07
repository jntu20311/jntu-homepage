import { CONSTANTS } from "@/shared/configs/constants";
import { PageHeader } from "@/shared/ui/page-header";
import { KakaoMap } from "@/widgets/kakao-map";

export const LocationPage = () => {
  return (
    <div>
      <PageHeader title="오시는길" description="찾아오시는 길을 안내합니다." />

      <KakaoMap />

      <div> {`우편번호 : ${CONSTANTS.POSTCODE}`}</div>
      <div>{CONSTANTS.ADDRESS}</div>
      <div>{CONSTANTS.TEL}</div>
    </div>
  );
};
