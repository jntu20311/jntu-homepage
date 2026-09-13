import type { DataProvider } from "@refinedev/core";
import { dataProvider as supabaseDataProvider } from "@refinedev/supabase";
import { supabase } from "@/shared/api/supabase";
import {
  cleanupRemovedImages,
  commitContentImages,
  deletePaths,
  extractBoardImagePaths,
  urlToBoardPath,
} from "./lib/storageAssets";

/** CKEditor 본문(content)을 갖는 게시판 리소스 */
const BOARD_RESOURCES = new Set([
  "press",
  "activities",
  "month_activities",
  "benefits",
]);

const base = supabaseDataProvider(supabase);

type AnyRecord = Record<string, unknown>;

const collectRecordAssetPaths = (record: AnyRecord): string[] => {
  const paths = extractBoardImagePaths(record?.content as string);
  for (const key of ["image_url", "attachment_url"]) {
    const url = record?.[key];
    if (typeof url === "string") {
      const p = urlToBoardPath(url);
      if (p) paths.push(p);
    }
  }
  return [...new Set(paths)];
};

/**
 * 기본 데이터 프로바이더 (공개 테이블).
 * 게시판 리소스는 create/update/deleteOne 에 Storage 고아 정리 로직을 덧붙인다.
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
export const dataProvider: DataProvider = { ...base };

dataProvider.create = async (params: any): Promise<any> => {
  const result = await base.create(params);
  if (!BOARD_RESOURCES.has(params.resource)) return result;

  const record = result.data as AnyRecord;
  const content = record?.content as string | undefined;
  if (content) {
    const committed = await commitContentImages(
      content,
      params.resource,
      record.id as string | number,
    );
    if (committed !== content) {
      const updated = await base.update({
        resource: params.resource,
        id: record.id as string | number,
        variables: { content: committed },
      });
      return { data: updated.data };
    }
  }
  return result;
};

dataProvider.update = async (params: any): Promise<any> => {
  if (!BOARD_RESOURCES.has(params.resource)) return base.update(params);

  // 이전 본문 확보 (제거된 이미지 정리를 위해)
  let oldContent: string | undefined;
  try {
    const prev = await base.getOne({
      resource: params.resource,
      id: params.id,
    });
    oldContent = (prev.data as AnyRecord)?.content as string | undefined;
  } catch {
    oldContent = undefined;
  }

  const result = await base.update(params);
  const nextContentRaw = (params.variables as AnyRecord)?.content as
    | string
    | undefined;

  if (typeof nextContentRaw === "string") {
    const committed = await commitContentImages(
      nextContentRaw,
      params.resource,
      params.id,
    );
    let finalRecord = result.data;
    if (committed !== nextContentRaw) {
      const updated = await base.update({
        resource: params.resource,
        id: params.id,
        variables: { content: committed },
      });
      finalRecord = updated.data;
    }
    await cleanupRemovedImages(oldContent, committed);
    return { data: finalRecord };
  }

  return { data: result.data };
};

dataProvider.deleteOne = async (params: any): Promise<any> => {
  if (!BOARD_RESOURCES.has(params.resource)) return base.deleteOne(params);

  let assetPaths: string[] = [];
  try {
    const prev = await base.getOne({
      resource: params.resource,
      id: params.id,
    });
    assetPaths = collectRecordAssetPaths(prev.data as AnyRecord);
  } catch {
    assetPaths = [];
  }

  const result = await base.deleteOne(params);
  await deletePaths(assetPaths);
  return result;
};

/* -------------------------------------------------------------------------- */
/* 관리자 계정 프로바이더 — service_role 이 필요하므로 Worker API 를 호출        */
/* -------------------------------------------------------------------------- */

const authHeader = async (): Promise<Record<string, string>> => {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const ADMIN_API = "/api/admin/users";

export const adminUsersProvider: DataProvider = {
  getApiUrl: () => ADMIN_API,

  getList: async () => {
    const res = await fetch(ADMIN_API, { headers: await authHeader() });
    if (!res.ok) throw new Error(`관리자 목록 조회 실패 (${res.status})`);
    const data = await res.json();
    return { data: data.users ?? data, total: (data.users ?? data).length };
  },

  getOne: async ({ id }) => {
    const res = await fetch(ADMIN_API, { headers: await authHeader() });
    const data = await res.json();
    const list = data.users ?? data;
    return { data: list.find((u: { id: string }) => u.id === id) };
  },

  create: async ({ variables }) => {
    const res = await fetch(ADMIN_API, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...(await authHeader()) },
      body: JSON.stringify(variables),
    });
    const body = await res.json();
    if (!res.ok) throw new Error(body?.error ?? "관리자 생성 실패");
    return { data: body };
  },

  deleteOne: async ({ id }) => {
    const res = await fetch(`${ADMIN_API}/${id}`, {
      method: "DELETE",
      headers: await authHeader(),
    });
    const body = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(body?.error ?? "관리자 삭제 실패");
    return { data: body };
  },

  getMany: async ({ ids }) => {
    const res = await fetch(ADMIN_API, { headers: await authHeader() });
    const data = await res.json();
    const list = data.users ?? data;
    return {
      data: list.filter((u: { id: string }) => ids.includes(u.id)),
    };
  },

  update: async () => {
    throw new Error("관리자 계정 수정은 지원하지 않습니다.");
  },
};
