import { useState, useEffect } from "react";

export function useAverageColor(src: string) {
  const [bgColor, setBgColor] = useState<string>("rgba(0, 0, 0, 0)");

  useEffect(() => {
    if (!src) return;

    const img = new Image();
    // 외부 도메인 이미지의 Canvas 오염(CORS) 방지
    img.crossOrigin = "anonymous";
    img.src = src;

    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // 1. 연산 속도를 위해 캔버스 크기를 50x50으로 축소
      const sampleSize = 50;
      canvas.width = sampleSize;
      canvas.height = sampleSize;

      ctx.drawImage(img, 0, 0, sampleSize, sampleSize);

      try {
        // 2. 픽셀 데이터 추출
        const imageData = ctx.getImageData(0, 0, sampleSize, sampleSize);
        const data = imageData.data;

        let r = 0,
          g = 0,
          b = 0;
        const totalPixels = data.length / 4;

        for (let i = 0; i < data.length; i += 4) {
          r += data[i];
          g += data[i + 1];
          b += data[i + 2];
        }

        // 3. 평균 RGB 계산
        r = Math.floor(r / totalPixels);
        g = Math.floor(g / totalPixels);
        b = Math.floor(b / totalPixels);

        setBgColor(`rgba(${r}, ${g}, ${b}, 0.35)`);
      } catch (error) {
        // CORS 문제 등으로 데이터 읽기가 거부될 경우 예외 처리
        console.warn("Canvas getImageData failed:", error);
      }
    };
  }, [src]);

  return bgColor;
}
