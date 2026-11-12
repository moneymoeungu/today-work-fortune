import type { Metadata, Viewport } from "next";
import "./globals.css";

const title = "오늘의 업무 운세, 당신의 카드는?";
const description = "카드를 한 장 뽑으면, 부엉이가 나만을 위한 오늘의 업무 운세를 알려줘요.";

export const metadata: Metadata = {
  title,
  description,
  // TODO: 기획 확인 - 배포 URL 확정 후 metadataBase를 실제 도메인으로 교체
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://moneymoeungu.github.io/today-work-fortune"
  ),
  openGraph: {
    title,
    description,
    type: "website",
    locale: "ko_KR",
    siteName: "오늘의 업무 운세",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "오늘의 업무 운세 부엉이 타로" }],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/og.png"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#140a2e",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head>
        <link rel="preconnect" href="https://cdn.jsdelivr.net" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          crossOrigin="anonymous"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Gowun+Batang:wght@400;700&family=Grandiflora+One&family=Song+Myung&display=swap"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
