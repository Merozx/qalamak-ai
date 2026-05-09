import './globals.css';

export const metadata = {
  title: 'قلمك AI | مولّد محتوى عربي للمسوّقين',
  description: 'SaaS عربي لتوليد كابشنات وإعلانات وإيميلات ووصف منتجات باللهجات العربية.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <body>{children}</body>
    </html>
  );
}
