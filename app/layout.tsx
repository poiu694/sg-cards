import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import './globals.css';

const pretendard = localFont({
  src: '../public/fonts/PretendardVariable.woff2',
  variable: '--font-pretendard',
  display: 'swap',
  weight: '100 900',
});

export const metadata: Metadata = {
  title: '시라노 연애조작단 💝',
  description: '당신의 특별한 인연을 찾아보세요',
  openGraph: {
    title: '시라노 연애조작단 💝',
    description: '당신의 특별한 인연을 찾아보세요',
    type: 'website',
    images: [{ url: '/opengraph-image', width: 1200, height: 630 }],
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#080B1A',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className={pretendard.variable}>
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Noto+Serif+KR:wght@400;700&display=swap"
        />
      </head>
      <body style={{ fontFamily: 'var(--font-pretendard), Pretendard, -apple-system, sans-serif' }}>
        {children}
      </body>
    </html>
  );
}
