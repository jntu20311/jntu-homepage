import { supabase } from "@/shared/api/supabase";

/**
 * 홈 배너(banners 버킷) 이미지의 Storage 고아 파일 관리 유틸.
 *
 * 흐름 (게시판 board 패턴과 동일):
 *  1) 업로드 시 `banners/tmp/<uuid>.<ext>` 에 즉시 업로드
 *  2) 저장 시 commitBannerImage() 로 tmp → `images/<uuid>.<ext>` 이동 + URL 치환
 *  3) 수정 시 교체/제거된 이전 이미지 삭제, 삭제 시 이미지 삭제
 *  4) 미저장·이탈분(tmp)은 Worker cron 이 24h+ 스윕
 */

export const BANNER_BUCKET = "banners";

const PUBLIC_MARKER = `/storage/v1/object/public/${BANNER_BUCKET}/`;

/** banners 버킷 public URL → 버킷 내부 object 경로. 아니면 null. */
export const urlToBannerPath = (url: string): string | null => {
  const idx = url.indexOf(PUBLIC_MARKER);
  if (idx === -1) return null;
  return decodeURIComponent(url.slice(idx + PUBLIC_MARKER.length).split("?")[0]);
};

const bannerPathToUrl = (path: string): string =>
  supabase.storage.from(BANNER_BUCKET).getPublicUrl(path).data.publicUrl;

const fileName = (path: string) => path.split("/").pop() as string;

/**
 * tmp/ 배너 이미지를 images/ 로 커밋하고 최종 URL 반환.
 * 이미 커밋됐거나(images/·버킷 밖) 이동 실패 시 원본 URL 을 그대로 반환한다.
 */
export const commitBannerImage = async (
  url: string | null | undefined,
): Promise<string | null | undefined> => {
  if (!url) return url;
  const path = urlToBannerPath(url);
  if (!path || !path.startsWith("tmp/")) return url; // 이미 커밋됐거나 버킷 밖
  const dest = `images/${fileName(path)}`;
  const { error } = await supabase.storage.from(BANNER_BUCKET).move(path, dest);
  if (error) return url; // 이동 실패 시 원본 유지 (스윕 대상)
  return bannerPathToUrl(dest);
};

/** 배너 이미지(단일) 삭제 (조용히 실패 허용) */
export const deleteBannerImage = async (
  url: string | null | undefined,
): Promise<void> => {
  const path = url ? urlToBannerPath(url) : null;
  if (path) await supabase.storage.from(BANNER_BUCKET).remove([path]);
};
