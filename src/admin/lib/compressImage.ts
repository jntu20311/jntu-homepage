/**
 * 이미지 업로드 전 클라이언트 압축 유틸.
 *
 * - canvas 로 재인코딩하여 용량을 줄인다. (외부 라이브러리 불필요)
 * - 긴 변 기준 maxDimension 으로만 축소하므로 화면 표시 크기에선 화질 차이가 거의 없다.
 * - WebP(손실) 로 인코딩: 알파 채널을 유지하면서 JPEG 수준 이상의 압축률을 얻는다.
 * - 이미지가 아니거나(첨부파일), 애니메이션(GIF)/벡터(SVG), 디코딩 실패,
 *   혹은 압축 결과가 원본보다 크면 원본 File 을 그대로 반환한다.
 */

interface CompressOptions {
  /** 긴 변 최대 픽셀 (기본 1920 = Full HD 폭, 표시 크기 대비 충분한 여유) */
  maxDimension?: number;
  /** 인코딩 품질 0~1 (기본 0.82 = 육안상 무손실에 가까움) */
  quality?: number;
  /** 출력 MIME (기본 image/webp) */
  mimeType?: string;
}

/** 재인코딩하지 않고 원본을 유지할 타입 (애니메이션/벡터) */
const SKIP_TYPES = new Set(["image/gif", "image/svg+xml"]);

const extForMime = (mime: string): string =>
  mime === "image/webp" ? "webp" : mime === "image/jpeg" ? "jpg" : "png";

export const compressImage = async (
  file: File,
  options: CompressOptions = {},
): Promise<File> => {
  const {
    maxDimension = 1920,
    quality = 0.82,
    mimeType = "image/webp",
  } = options;

  // 이미지가 아니거나 애니메이션/벡터는 손대지 않는다.
  if (!file.type.startsWith("image/") || SKIP_TYPES.has(file.type)) return file;

  let bitmap: ImageBitmap;
  try {
    // from-image: 휴대폰 사진의 EXIF 회전 정보를 반영해 디코딩.
    bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
  } catch {
    return file; // 디코딩 실패 시 원본 유지
  }

  const { width, height } = bitmap;
  const scale = Math.min(1, maxDimension / Math.max(width, height));
  const targetW = Math.max(1, Math.round(width * scale));
  const targetH = Math.max(1, Math.round(height * scale));

  const canvas = document.createElement("canvas");
  canvas.width = targetW;
  canvas.height = targetH;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    bitmap.close?.();
    return file;
  }
  ctx.drawImage(bitmap, 0, 0, targetW, targetH);
  bitmap.close?.();

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, mimeType, quality),
  );
  // 인코딩 실패(미지원)하거나 원본보다 크면(이미 최적화된 파일 등) 원본 유지.
  if (!blob || blob.size >= file.size) return file;

  const baseName = file.name.replace(/\.[^.]+$/, "") || "image";
  return new File([blob], `${baseName}.${extForMime(mimeType)}`, {
    type: mimeType,
    lastModified: Date.now(),
  });
};
