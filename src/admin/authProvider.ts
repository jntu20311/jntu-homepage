import type { AuthProvider } from "@refinedev/core";
import { supabase } from "@/shared/lib/supabase";

/**
 * 현재 세션 사용자가 admins 테이블에 존재하는지 확인.
 * RLS(admins_select)로 관리자 본인만 자신의 행을 읽을 수 있으므로,
 * 행이 조회되면 관리자, 아니면 비관리자.
 */
const fetchAdmin = async (userId: string) => {
  const { data } = await supabase
    .from("admins")
    .select("id, email, name, is_protected")
    .eq("id", userId)
    .maybeSingle();
  return data;
};

export const authProvider: AuthProvider = {
  login: async ({ email, password }) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return {
        success: false,
        error: { name: "로그인 실패", message: error.message },
      };
    }

    // 관리자 여부 확인 — 관리자가 아니면 즉시 로그아웃 후 차단
    const admin = data.user ? await fetchAdmin(data.user.id) : null;
    if (!admin) {
      await supabase.auth.signOut();
      return {
        success: false,
        error: {
          name: "권한 없음",
          message: "관리자 권한이 없는 계정입니다.",
        },
      };
    }

    return { success: true, redirectTo: "/admin" };
  },

  logout: async () => {
    await supabase.auth.signOut();
    return { success: true, redirectTo: "/admin/login" };
  },

  check: async () => {
    const { data } = await supabase.auth.getSession();
    const session = data.session;
    if (!session) {
      return { authenticated: false, redirectTo: "/admin/login" };
    }

    const admin = await fetchAdmin(session.user.id);
    if (!admin) {
      await supabase.auth.signOut();
      return { authenticated: false, redirectTo: "/admin/login" };
    }

    return { authenticated: true };
  },

  onError: async (error) => {
    if (error?.statusCode === 401 || error?.status === 401) {
      return { logout: true, redirectTo: "/admin/login" };
    }
    return { error };
  },

  getIdentity: async () => {
    const { data } = await supabase.auth.getUser();
    if (!data.user) return null;
    const admin = await fetchAdmin(data.user.id);
    return {
      id: data.user.id,
      name: admin?.name || admin?.email || data.user.email,
      email: data.user.email,
      isProtected: admin?.is_protected ?? false,
    };
  },

  getPermissions: async () => {
    const { data } = await supabase.auth.getUser();
    if (!data.user) return null;
    const admin = await fetchAdmin(data.user.id);
    return admin ? "admin" : null;
  },
};
