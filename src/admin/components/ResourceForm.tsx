import { useEffect, useState } from "react";
import { Controller } from "react-hook-form";
import { useForm } from "@refinedev/react-hook-form";
import { useGetIdentity } from "@refinedev/core";
import { useNavigate } from "react-router-dom";
import { Button } from "@/shared/ui/button";
import { cn } from "@/shared/lib/utils";
import type { FieldDef, ResourceDef } from "../config";
import { uploadPublicFile } from "../lib/upload";
import { BOARD_BUCKET } from "../lib/storageAssets";
import { BANNER_BUCKET } from "../lib/bannerAssets";
import { CKEditorField } from "./CKEditorField";
import { Markdown } from "@/shared/ui/markdown";

interface ResourceFormProps {
  resource: ResourceDef;
  action: "create" | "edit";
  id?: string;
}

const inputClass =
  "w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring/40";

/** 저장된 ISO(UTC) → datetime-local 입력값(브라우저 로컬시간) */
const toLocalInput = (iso: unknown): string => {
  if (!iso || typeof iso !== "string") return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
    d.getHours(),
  )}:${pad(d.getMinutes())}`;
};

/** datetime-local 입력값(로컬시간) → 저장용 ISO(UTC). 비우면 null */
const fromLocalInput = (local: string): string | null =>
  local ? new Date(local).toISOString() : null;

export const ResourceForm = ({ resource, action, id }: ResourceFormProps) => {
  const navigate = useNavigate();
  const { data: identity } = useGetIdentity<{ id?: string; name?: string }>();
  const {
    refineCore: { onFinish, formLoading },
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    refineCoreProps: {
      resource: resource.name,
      action,
      id,
      dataProviderName: resource.dataProviderName,
      redirect: "list",
      meta: resource.idColumnName
        ? { idColumnName: resource.idColumnName }
        : undefined,
    },
  });

  const fields = resource.fields.filter(
    (f) => !(action === "edit" && f.createOnly),
  );
  const hasMarkdown = fields.some((f) => f.markdown);

  // 생성 시 defaultNow datetime 필드를 현재 시각으로 초기화 (예: 공개 예약 일시)
  useEffect(() => {
    if (action !== "create") return;
    const now = new Date().toISOString();
    for (const f of resource.fields) {
      if (f.type === "datetime" && f.defaultNow) setValue(f.name, now);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [action, resource.name]);

  // 생성 시 작성자를 로그인한 관리자(admins)와 연동:
  //   author_id → 작성 관리자 admins.id (추적용), author → 표시용 이름 스냅샷
  const submit = (values: Record<string, unknown>) => {
    if (action === "create" && resource.autoAuthor) {
      values.author_id = identity?.id ?? null;
      values.author = identity?.name ?? "";
    }
    return onFinish(values);
  };

  return (
    <form
      onSubmit={handleSubmit(submit)}
      className={cn("space-y-5", hasMarkdown ? "max-w-5xl" : "max-w-3xl")}
    >
      <h1 className="text-xl font-bold">
        {resource.label} {action === "create" ? "등록" : "수정"}
      </h1>

      {fields.map((field) => (
        <Field
          key={field.name}
          field={field}
          register={register}
          control={control}
          setValue={setValue}
          watch={watch}
          postType={resource.postType}
          error={errors[field.name]?.message as string | undefined}
        />
      ))}

      <div className="flex gap-2 pt-2">
        <Button type="submit" disabled={formLoading}>
          {formLoading ? "저장 중..." : "저장"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => navigate(`/admin/${resource.name}`)}
        >
          취소
        </Button>
      </div>
    </form>
  );
};

/* eslint-disable @typescript-eslint/no-explicit-any */
interface FieldProps {
  field: FieldDef;
  register: any;
  control: any;
  setValue: any;
  watch: any;
  postType?: string;
  error?: string;
}

const Field = ({
  field,
  register,
  control,
  setValue,
  watch,
  postType,
  error,
}: FieldProps) => {
  const [uploading, setUploading] = useState(false);
  const rules = field.required
    ? { required: `${field.label}은(는) 필수입니다.` }
    : {};

  const handleUpload = async (file: File) => {
    if (!field.bucket) return;
    setUploading(true);
    try {
      // board/banners 자산은 tmp 로 올린 뒤 저장 시 커밋 → 미저장분은 cron 이 스윕.
      const folder =
        field.bucket === BOARD_BUCKET && postType
          ? `tmp/${postType}`
          : field.bucket === BANNER_BUCKET
            ? "tmp"
            : (field.folder ?? "misc");
      const url = await uploadPublicFile(field.bucket, folder, file);
      setValue(field.name, url, { shouldDirty: true });
      if (field.fileNameField) {
        setValue(field.fileNameField, file.name, { shouldDirty: true });
      }
    } finally {
      setUploading(false);
    }
  };

  const label = (
    <label className="mb-1 block text-sm font-medium">
      {field.label}
      {field.required && <span className="text-destructive"> *</span>}
    </label>
  );

  const helperAndError = (
    <>
      {field.helper && (
        <p className="mt-1 text-xs text-muted-foreground">{field.helper}</p>
      )}
      {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
    </>
  );

  switch (field.type) {
    case "boolean":
      return (
        <div className="flex items-center gap-2">
          <input
            id={field.name}
            type="checkbox"
            className="size-4"
            {...register(field.name)}
          />
          <label htmlFor={field.name} className="text-sm font-medium">
            {field.label}
          </label>
        </div>
      );

    case "textarea":
      return (
        <div>
          {label}
          {field.markdown ? (
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <div className="flex flex-col">
                <span className="mb-1 text-xs font-medium text-muted-foreground">
                  작성 (Markdown)
                </span>
                <textarea
                  rows={20}
                  className={cn(inputClass, "h-full min-h-80 font-mono")}
                  {...register(field.name, rules)}
                />
              </div>
              <div className="flex flex-col">
                <span className="mb-1 text-xs font-medium text-muted-foreground">
                  미리보기
                </span>
                <div className="min-h-80 overflow-auto rounded-md border border-input bg-background px-4 py-2">
                  <Markdown>{watch(field.name) || "_(내용 없음)_"}</Markdown>
                </div>
              </div>
            </div>
          ) : (
            <textarea
              rows={12}
              className={cn(inputClass, "font-mono")}
              {...register(field.name, rules)}
            />
          )}

          {helperAndError}
        </div>
      );

    case "select":
      return (
        <div>
          {label}
          <select className={inputClass} {...register(field.name, rules)}>
            {field.options?.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          {helperAndError}
        </div>
      );

    case "richtext":
      return (
        <div>
          {label}
          <Controller
            name={field.name}
            control={control}
            render={({ field: f }) => (
              <CKEditorField
                value={f.value}
                onChange={f.onChange}
                postType={postType ?? "misc"}
              />
            )}
          />
          {helperAndError}
        </div>
      );

    case "image": {
      const current = watch(field.name);
      return (
        <div>
          {label}
          {current && (
            <img
              src={current}
              alt=""
              className="mb-2 h-24 w-auto rounded border object-contain"
            />
          )}
          <input
            type="file"
            accept="image/*"
            className="text-sm border rounded-sm p-2 cursor-pointer hover:bg-gray-100"
            onChange={(e) =>
              e.target.files?.[0] && handleUpload(e.target.files[0])
            }
          />
          {uploading && (
            <p className="mt-1 text-xs text-muted-foreground">업로드 중...</p>
          )}
          <input type="hidden" {...register(field.name, rules)} />
          {helperAndError}
        </div>
      );
    }

    case "file": {
      const current = watch(field.name);
      const currentName = field.fileNameField
        ? watch(field.fileNameField)
        : undefined;
      return (
        <div>
          {label}
          {current && (
            <p className="mb-1 text-xs text-muted-foreground">
              현재: {currentName || current}
            </p>
          )}
          <input
            type="file"
            className="text-sm border rounded-sm p-2 cursor-pointer hover:bg-gray-100"
            onChange={(e) =>
              e.target.files?.[0] && handleUpload(e.target.files[0])
            }
          />
          {uploading && (
            <p className="mt-1 text-xs text-muted-foreground">업로드 중...</p>
          )}
          <input type="hidden" {...register(field.name)} />
          {field.fileNameField && (
            <input type="hidden" {...register(field.fileNameField)} />
          )}
          {helperAndError}
        </div>
      );
    }

    case "number":
      return (
        <div>
          {label}
          <input
            type="number"
            className={inputClass}
            {...register(field.name, { ...rules, valueAsNumber: true })}
          />
          {helperAndError}
        </div>
      );

    case "date":
      return (
        <div>
          {label}
          <input
            type="date"
            className={inputClass}
            max="9999-12-31T23:59"
            {...register(field.name, rules)}
          />
          {helperAndError}
        </div>
      );

    case "datetime":
      return (
        <div>
          {label}
          <Controller
            name={field.name}
            control={control}
            rules={rules}
            render={({ field: f }) => (
              <input
                type="datetime-local"
                className={inputClass}
                max="9999-12-31T23:59"
                value={toLocalInput(f.value)}
                onChange={(e) => f.onChange(fromLocalInput(e.target.value))}
              />
            )}
          />
          {helperAndError}
        </div>
      );

    default:
      return (
        <div>
          {label}
          <input
            type={field.type === "password" ? "password" : "text"}
            className={inputClass}
            {...register(field.name, rules)}
          />
          {helperAndError}
        </div>
      );
  }
};
