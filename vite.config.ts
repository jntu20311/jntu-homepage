import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { cloudflare } from "@cloudflare/vite-plugin";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import { createHtmlPlugin } from "vite-plugin-html";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const kakaoKey = process.env.VITE_KAKAO_APP_KEY || env.VITE_KAKAO_APP_KEY;

  return {
    plugins: [
      react(),
      createHtmlPlugin({
        minify: true, // HTML 압축 여부 (선택)
        inject: {
          data: {
            VITE_KAKAO_APP_KEY: kakaoKey,
          },
        },
      }),
      cloudflare(),
      tailwindcss(),
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});
