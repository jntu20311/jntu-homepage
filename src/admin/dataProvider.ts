import type { DataProvider } from "@refinedev/core";
import { dataProvider as supabaseDataProvider } from "@refinedev/supabase";
import { supabase } from "@/shared/api/supabase";
import {
  cleanupRemovedImages,
  commitBoardAsset,
  commitContentImages,
  deletePaths,
  extractBoardImagePaths,
  firstImageSrc,
  urlToBoardPath,
} from "./lib/storageAssets";

import {
  commitBannerImage,
  deleteBannerImage,
} from "./lib/bannerAssets";

/** 게시판 tmp 커밋 대상 단일 자산 필드 (대표 이미지 / 첨부파일) */
const ASSET_FIELDS = ["image_url", "attachment_url"] as const;

/** 홈 배너 리소스명 (자체 tmp→commit / 교체·삭제 정리) */
const BANNER_RESOURCE = "banners";

/** CKEditor 본문(content)을 갖는 게시판 리소스 */
const BOARD_RESOURCES = new Set([
  "press",
  "activities",
  "month_activities",
  "benefits",
]);

/** 목록 썸네일(image_url)을 본문 첫 이미지에서 자동 도출하는 리소스 */
const THUMBNAIL_FROM_CONTENT = new Set([
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

  // 홈 배너: 업로드된 tmp 이미지를 images/ 로 커밋
  if (params.resource === BANNER_RESOURCE) {
    const record = result.data as AnyRecord;
    const url = record?.image_url as string | undefined;
    const finalUrl = await commitBannerImage(url);
    if (finalUrl && finalUrl !== url) {
      const updated = await base.update({
        resource: params.resource,
        id: record.id as string | number,
        variables: { image_url: finalUrl },
      });
      return { data: updated.data };
    }
    return result;
  }

  if (!BOARD_RESOURCES.has(params.resource)) return result;

  const record = result.data as AnyRecord;
  const postId = record.id as string | number;
  const patch: AnyRecord = {};

  // 본문 이미지 tmp → posts 커밋
  const content = record?.content as string | undefined;
  let committedContent = content;
  if (content) {
    const committed = await commitContentImages(content, params.resource, postId);
    if (committed !== content) patch.content = committed;
    committedContent = committed;
  }

  // 대표 이미지 / 첨부 tmp → posts 커밋
  for (const key of ASSET_FIELDS) {
    const url = record?.[key] as string | undefined;
    if (typeof url === "string" && url) {
      const finalUrl = await commitBoardAsset(url, params.resource, postId);
      if (finalUrl !== url) patch[key] = finalUrl;
    }
  }

  // 썸네일: 본문(커밋 후)의 첫 이미지를 대표 이미지로 설정
  if (THUMBNAIL_FROM_CONTENT.has(params.resource)) {
    const thumb = firstImageSrc(committedContent);
    if (((record.image_url as string) ?? null) !== (thumb ?? null)) {
      patch.image_url = thumb;
    }
  }

  if (Object.keys(patch).length > 0) {
    const updated = await base.update({
      resource: params.resource,
      id: postId,
      variables: patch,
    });
    return { data: updated.data };
  }
  return result;
};

dataProvider.update = async (params: any): Promise<any> => {
  // 홈 배너: 새 tmp 이미지 커밋 + 교체/제거된 이전 이미지 삭제
  if (params.resource === BANNER_RESOURCE) {
    let prevUrl: string | undefined;
    try {
      const p = await base.getOne({ resource: params.resource, id: params.id });
      prevUrl = (p.data as AnyRecord)?.image_url as string | undefined;
    } catch {
      prevUrl = undefined;
    }

    const result = await base.update(params);
    const vars = (params.variables ?? {}) as AnyRecord;

    if ("image_url" in vars) {
      const newUrl = vars.image_url as string | undefined;
      let finalUrl: string | null | undefined = newUrl;
      if (typeof newUrl === "string" && newUrl) {
        finalUrl = await commitBannerImage(newUrl);
      }
      if (typeof prevUrl === "string" && prevUrl && prevUrl !== finalUrl) {
        await deleteBannerImage(prevUrl);
      }
      if (finalUrl && finalUrl !== newUrl) {
        const updated = await base.update({
          resource: params.resource,
          id: params.id,
          variables: { image_url: finalUrl },
        });
        return { data: updated.data };
      }
    }
    return { data: result.data };
  }

  if (!BOARD_RESOURCES.has(params.resource)) return base.update(params);

  // 이전 레코드 확보 (제거/교체된 자산 정리를 위해)
  let prev: AnyRecord | undefined;
  try {
    const p = await base.getOne({ resource: params.resource, id: params.id });
    prev = p.data as AnyRecord;
  } catch {
    prev = undefined;
  }

  const result = await base.update(params);
  const vars = (params.variables ?? {}) as AnyRecord;
  const patch: AnyRecord = {};

  // 본문 이미지: tmp 커밋 + 제거된 이미지 정리
  const nextContentRaw = vars.content as string | undefined;
  let committedContent: string | undefined;
  if (typeof nextContentRaw === "string") {
    const committed = await commitContentImages(
      nextContentRaw,
      params.resource,
      params.id,
    );
    if (committed !== nextContentRaw) patch.content = committed;
    await cleanupRemovedImages(prev?.content as string | undefined, committed);
    committedContent = committed;
  }

  // 썸네일: 본문(커밋 후)의 첫 이미지를 대표 이미지로 재설정
  if (
    THUMBNAIL_FROM_CONTENT.has(params.resource) &&
    committedContent !== undefined
  ) {
    const thumb = firstImageSrc(committedContent);
    const prevThumb = (prev?.image_url as string) ?? null;
    if ((thumb ?? null) !== prevThumb) patch.image_url = thumb;
  }

  // 대표 이미지 / 첨부: 새 tmp 파일 커밋 + 교체/제거된 이전 파일 삭제
  for (const key of ASSET_FIELDS) {
    if (!(key in vars)) continue;
    const newUrl = vars[key] as string | undefined;
    const oldUrl = prev?.[key] as string | undefined;

    let finalUrl: string | null | undefined = newUrl;
    if (typeof newUrl === "string" && newUrl) {
      finalUrl = await commitBoardAsset(newUrl, params.resource, params.id);
      if (finalUrl !== newUrl) patch[key] = finalUrl;
    }

    // 이전 파일이 최종본과 다르면(교체/제거) posts 원본 삭제
    if (typeof oldUrl === "string" && oldUrl && oldUrl !== finalUrl) {
      const oldPath = urlToBoardPath(oldUrl);
      if (oldPath && oldPath.startsWith("posts/")) await deletePaths([oldPath]);
    }
  }

  if (Object.keys(patch).length > 0) {
    const updated = await base.update({
      resource: params.resource,
      id: params.id,
      variables: patch,
    });
    return { data: updated.data };
  }
  return { data: result.data };
};

dataProvider.deleteOne = async (params: any): Promise<any> => {
  // 홈 배너: 삭제 시 이미지도 제거
  if (params.resource === BANNER_RESOURCE) {
    let url: string | undefined;
    try {
      const p = await base.getOne({ resource: params.resource, id: params.id });
      url = (p.data as AnyRecord)?.image_url as string | undefined;
    } catch {
      url = undefined;
    }
    const result = await base.deleteOne(params);
    await deleteBannerImage(url);
    return result;
  }

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
