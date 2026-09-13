import { supabase } from "@/shared/lib/supabase";

/**
 * 게시판 본문(CKEditor) 이미지의 Storage 고아 파일 관리 유틸.
 *
 * 이미지 흐름:
 *  1) CKEditor 업로드 어댑터가 이미지를 `board/tmp/<postType>/<uuid>.<ext>` 에 즉시 업로드
 *  2) 게시글 저장 시 commitContentImages() 로 tmp → `posts/<postType>/<postId>/...` 로 이동하고
 *     본문 HTML 안의 URL 을 최종 URL 로 치환
 *  3) 수정 시 이전 본문에는 있었으나 새 본문에서 빠진 이미지는 삭제(deletePaths)
 *  4) 삭제 시 본문의 모든 이미지 + 대표 이미지/첨부 삭제
 */

export const BOARD_BUCKET = "board";

const PUBLIC_MARKER = `/storage/v1/object/public/${BOARD_BUCKET}/`;

/** board 버킷 public URL → 버킷 내부 object 경로. 아니면 null. */
export const urlToBoardPath = (url: string): string | null => {
  const idx = url.indexOf(PUBLIC_MARKER);
  if (idx === -1) return null;
  const path = url.slice(idx + PUBLIC_MARKER.length);
  return decodeURIComponent(path.split("?")[0]);
};

/** 경로 → public URL */
export const boardPathToUrl = (path: string): string =>
  supabase.storage.from(BOARD_BUCKET).getPublicUrl(path).data.publicUrl;

/** HTML 본문에서 board 버킷에 속한 이미지 object 경로 집합 추출 */
export const extractBoardImagePaths = (html: string | null | undefined): string[] => {
  if (!html) return [];
  const paths = new Set<string>();
  const re = /<img[^>]+src=["']([^"']+)["']/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html)) !== null) {
    const p = urlToBoardPath(m[1]);
    if (p) paths.add(p);
  }
  return [...paths];
};

/** Storage 객체 삭제 (조용히 실패 허용) */
export const deletePaths = async (paths: string[]): Promise<void> => {
  const targets = paths.filter(Boolean);
  if (targets.length === 0) return;
  await supabase.storage.from(BOARD_BUCKET).remove(targets);
};

const fileName = (path: string) => path.split("/").pop() as string;

/**
 * 본문 내 tmp 이미지를 최종 경로로 이동하고 URL 을 치환한 새 HTML 반환.
 * 이미 최종 경로(posts/...)에 있는 이미지는 그대로 둔다.
 */
export const commitContentImages = async (
  html: string,
  postType: string,
  postId: string | number,
): Promise<string> => {
  let result = html;
  const paths = extractBoardImagePaths(html);

  for (const path of paths) {
    if (!path.startsWith("tmp/")) continue; // 이미 커밋된 이미지
    const dest = `posts/${postType}/${postId}/${fileName(path)}`;
    const { error } = await supabase.storage
      .from(BOARD_BUCKET)
      .move(path, dest);
    if (error) continue; // 이동 실패 시 원본 URL 유지 (스윕 대상)
    const from = boardPathToUrl(path);
    const to = boardPathToUrl(dest);
    result = result.split(from).join(to);
  }

  return result;
};

/**
 * 수정 시 제거된 본문 이미지 정리: old 에는 있으나 next 에는 없는 경로 삭제.
 * (최종 경로 posts/... 만 삭제 대상. tmp 는 스윕/commit 이 처리)
 */
export const cleanupRemovedImages = async (
  oldHtml: string | null | undefined,
  nextHtml: string | null | undefined,
): Promise<void> => {
  const oldPaths = extractBoardImagePaths(oldHtml).filter((p) =>
    p.startsWith("posts/"),
  );
  const nextPaths = new Set(extractBoardImagePaths(nextHtml));
  const removed = oldPaths.filter((p) => !nextPaths.has(p));
  await deletePaths(removed);
};
