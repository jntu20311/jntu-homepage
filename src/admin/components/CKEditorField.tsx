import { useMemo } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import {
  ClassicEditor,
  Essentials,
  Paragraph,
  Heading,
  Bold,
  Italic,
  Underline,
  Link,
  List,
  BlockQuote,
  Image,
  ImageUpload,
  ImageToolbar,
  ImageCaption,
  ImageStyle,
  ImageResize,
  Table,
  TableToolbar,
  LinkImage,
  type Editor,
  type EditorConfig,
  type FileLoader,
} from "ckeditor5";
import "ckeditor5/ckeditor5.css";
import { supabase } from "@/shared/api/supabase";
import { BOARD_BUCKET, boardPathToUrl } from "../lib/storageAssets";

/**
 * CKEditor 업로드 어댑터: 이미지를 board/tmp/<postType>/<uuid>.<ext> 에 즉시 업로드.
 * 게시글 저장 시 dataProvider 가 최종 경로로 이동/치환한다.
 */
class SupabaseUploadAdapter {
  constructor(
    private loader: FileLoader,
    private postType: string,
  ) {}

  async upload() {
    const file = (await this.loader.file) as File;
    const ext = file.name.includes(".") ? file.name.split(".").pop() : "png";
    const path = `tmp/${this.postType}/${crypto.randomUUID()}.${ext}`;
    const { error } = await supabase.storage
      .from(BOARD_BUCKET)
      .upload(path, file, { upsert: false, contentType: file.type });
    if (error) throw error;
    return { default: boardPathToUrl(path) };
  }

  abort() {}
}

// CKEditor 는 함수 플러그인을 `new` 로 생성하므로 화살표 함수가 아닌
// 일반 함수(생성 가능)를 반환해야 한다. (화살표 함수면 "is not a constructor")
const makeUploadPlugin = (postType: string) =>
  function SupabaseUploadPlugin(editor: Editor) {
    editor.plugins.get("FileRepository").createUploadAdapter = (loader) =>
      new SupabaseUploadAdapter(loader, postType);
  };

interface CKEditorFieldProps {
  value?: string;
  onChange?: (value: string) => void;
  /** 이미지 업로드 경로 구분용 (리소스명: press/activities/...) */
  postType: string;
}

export const CKEditorField = ({
  value,
  onChange,
  postType,
}: CKEditorFieldProps) => {
  const config = useMemo<EditorConfig>(
    () => ({
      licenseKey: "GPL",
      plugins: [
        Essentials,
        Paragraph,
        Heading,
        Bold,
        Italic,
        Underline,
        Link,
        List,
        LinkImage,
        BlockQuote,
        Image,
        ImageUpload,
        ImageToolbar,
        ImageCaption,
        ImageStyle,
        ImageResize,
        Table,
        TableToolbar,
      ],
      extraPlugins: [makeUploadPlugin(postType)],
      toolbar: [
        "undo",
        "redo",
        "|",
        "heading",
        "|",
        "bold",
        "italic",
        "underline",
        "link",
        "|",
        "bulletedList",
        "numberedList",
        "blockQuote",
        "|",
        "uploadImage",
        "insertTable",
      ],
      image: {
        toolbar: [
          "linkImage",
          "|",
          "imageStyle:inline",
          "imageStyle:block",
          "imageStyle:side",
          "|",
          "toggleImageCaption",
          "imageTextAlternative",
        ],
      },
      table: {
        contentToolbar: ["tableColumn", "tableRow", "mergeTableCells"],
      },
    }),
    [postType],
  );

  return (
    <div className="ck-content-wrapper">
      <CKEditor
        editor={ClassicEditor}
        config={config}
        data={value ?? ""}
        onChange={(_, editor) => onChange?.(editor.getData())}
      />
    </div>
  );
};
