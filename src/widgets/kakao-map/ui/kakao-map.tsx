import { useEffect, useRef } from "react";

export const KakaoMap = () => {
  const mapRef = useRef(null);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const kakao = (window as any).kakao;
    const container = mapRef.current; // 지도를 담을 영역의 DOM 참조

    const centerPosition = new kakao.maps.LatLng(34.8046684, 126.4838576);
    const markerPosition = new kakao.maps.LatLng(34.8046684, 126.4838576);

    // 지도를 생성할 때 필요한 기본 옵션
    const options = {
      center: centerPosition, // 지도의 중심좌표.
      level: 3, // 지도의 레벨(확대, 축소 정도)
    };

    const map = new kakao.maps.Map(container, options); // 지도 생성 및 객체 리턴

    // 마커를 생성합니다
    const marker = new kakao.maps.Marker({
      map: map, // 마커 표시할 지도
      position: markerPosition, // 마커 표시 위치
      title: "marker title", // 마커 타이틀 (마커에 마우스 호버시 표시),
      // image: markerImage,
    });

    // 마커가 지도 위에 표시되도록 설정합니다
    marker.setMap(map);

    // 1. 표시할 커스텀 HTML 작성
    const content = `
    <div style="
      background: #ffffff;
      border: 1px solid #22c55e;
      border-radius: 6px;
      padding: 6px 10px;
      box-shadow: 0 2px 6px rgba(0,0,0,0.15);
      transform: translateY(-45px); /* 마커 바로 위에 띄우기 위한 Y축 조절 */
      text-align: center;
    ">
      <div style="font-size: 14px; font-weight: bold; color: #111;">전남광주교사노동조합</div>
      <div style="font-size: 12px; color: #666;">전라남도 무안군 일로읍 오남로1길 9-4, 제이타워 5층</div>
    </div>
  `;

    // 2. 커스텀 오버레이 생성
    const customOverlay = new kakao.maps.CustomOverlay({
      position: markerPosition,
      content: content,
      yAnchor: 1.0, // 기준점을 밑변 중앙으로 설정
    });

    // 3. 지도에 표시
    customOverlay.setMap(map);

    // 1. 지도 타입 변경 컨트롤러 (일반지도 / 스카이뷰 전환 버튼)
    // const mapTypeControl = new kakao.maps.MapTypeControl();

    // TOPRIGHT(우상단)에 지도 타입 변경 컨트롤러 추가
    // map.addControl(mapTypeControl, kakao.maps.ControlPosition.TOPRIGHT);

    // 2. 줌 컨트롤러 (배율 조정 / 확대·축소 버튼)
    const zoomControl = new kakao.maps.ZoomControl();

    // RIGHT(우측 중앙)에 줌 컨트롤러 추가
    map.addControl(zoomControl, kakao.maps.ControlPosition.RIGHT);
  }, []);

  return (
    <div
      ref={mapRef}
      className="flex w-full items-center justify-center text-white text-3xl font-bold bg-blue-600 aspect-[2/1] whitespace-pre-wrap"
    ></div>
  );
};
