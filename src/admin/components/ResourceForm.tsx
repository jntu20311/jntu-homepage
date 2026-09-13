import { useState } from "react";
import { Controller } from "react-hook-form";
import { useForm } from "@refinedev/react-hook-form";
import { useNavigate } from "react-router-dom";
import { Button } from "@/shared/ui/button";
import { cn } from "@/shared/lib/utils";
import type { FieldDef, ResourceDef } from "../config";
import { uploadPublicFile } from "../lib/upload";
import { CKEditorField } from "./CKEditorField";

interface ResourceFormProps {
  resource: ResourceDef;
  action: "create" | "edit";
  id?: string;
}

const inputClass =
  "w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring/40";

export const ResourceForm = ({ resource, action, id }: ResourceFormProps) => {
  const navigate = useNavigate();
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

  return (
    <form onSubmit={handleSubmit(onFinish)} className="max-w-3xl space-y-5">
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
  const rules = field.required ? { required: `${field.label}은(는) 필수입니다.` } : {};

  const handleUpload = async (file: File) => {
    if (!field.bucket) return;
    setUploading(true);
    try {
      const url = await uploadPublicFile(field.bucket, field.folder ?? "misc", file);
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
          <textarea
            rows={12}
            className={cn(inputClass, "font-mono")}
            {...register(field.name, rules)}
          />
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
            className="text-sm"
            onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0])}
          />
          {uploading && <p className="mt-1 text-xs text-muted-foreground">업로드 중...</p>}
          <input type="hidden" {...register(field.name, rules)} />
          {helperAndError}
        </div>
      );
    }

    case "file": {
      const current = watch(field.name);
      const currentName = field.fileNameField ? watch(field.fileNameField) : undefined;
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
            className="text-sm"
            onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0])}
          />
          {uploading && <p className="mt-1 text-xs text-muted-foreground">업로드 중...</p>}
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
          <input type="date" className={inputClass} {...register(field.name, rules)} />
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
