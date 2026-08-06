import type { Metadata } from "next";

import "@/app/globals.css";
import { ThemeProvider } from "@/components/theme-provider";

export const metadata: Metadata = {
  title: { default: "AstroLive", template: "%s | AstroLive" },
  description: "Personalized astrology consultations with trusted experts.",
};

const themeScript = `(() => {
  try {
    const theme = localStorage.getItem('theme');
    const dark = theme ? theme === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches;
    document.documentElement.classList.toggle('dark', dark);
  } catch {}
})();`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head><script dangerouslySetInnerHTML={{ __html: themeScript }} /></head>
      <body><ThemeProvider>{children}</ThemeProvider></body>
    </html>
  );
}
