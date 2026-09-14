import { CONSTANTS } from "@/shared/configs/constants";
import { PageHeader } from "@/shared/ui/page-header";
import { KakaoMap } from "@/widgets/kakao-map";
import { MapPin, Phone } from "lucide-react";

const ADDRESS = CONSTANTS.ADDRESS.replace(/^주소\s*:\s*/, "");
const TEL = CONSTANTS.TEL.replace(/^전화\s*:\s*/, "");

export const LocationPage = () => {
  return (
    <div>
      <PageHeader title="오시는길" description="찾아오시는 길을 안내합니다." />

      <div className="overflow-hidden rounded-2xl border border-border shadow-sm">
        <KakaoMap />
      </div>

      <dl className="mt-6 flex flex-col gap-3">
        <div className="flex items-start gap-3 rounded-xl border border-border bg-card p-4">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
            <MapPin className="h-5 w-5" />
          </span>
          <div>
            <dt className="text-sm font-medium text-muted-foreground">주소</dt>
            <dd className="mt-0.5 font-medium leading-snug">
              {" "}
              {/* {`(${CONSTANTS.POSTCODE}) ${ADDRESS}`} */}
              {ADDRESS}
            </dd>
          </div>
        </div>

        <div className="flex items-start gap-3 rounded-xl border border-border bg-card p-4">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Phone className="h-5 w-5" />
          </span>
          <div>
            <dt className="text-sm font-medium text-muted-foreground">전화</dt>
            <dd className="mt-0.5 font-medium leading-snug">
              <a href={`tel:${CONSTANTS.PHONE}`} className="hover:text-primary">
                {TEL}
              </a>
            </dd>
          </div>
        </div>
      </dl>
    </div>
  );
};
