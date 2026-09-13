import { supabase } from "@/shared/lib/supabase";

/** 파일을 지정 버킷/폴더에 업로드하고 public URL 반환 */
export const uploadPublicFile = async (
  bucket: string,
  folder: string,
  file: File,
): Promise<string> => {
  const ext = file.name.includes(".") ? file.name.split(".").pop() : "bin";
  const path = `${folder}/${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage
    .from(bucket)
    .upload(path, file, { upsert: false, contentType: file.type });
  if (error) throw error;
  return supabase.storage.from(bucket).getPublicUrl(path).data.publicUrl;
};
