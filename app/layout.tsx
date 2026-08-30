import type { Metadata } from "next";
import { Noto_Sans_Devanagari, Noto_Serif_Devanagari } from "next/font/google";
import "./globals.css";
import { strings } from "@/lib/strings.hi";

const notoSansDevanagari = Noto_Sans_Devanagari({
  variable: "--font-devanagari-sans",
  subsets: ["devanagari", "latin"],
});

const notoSerifDevanagari = Noto_Serif_Devanagari({
  variable: "--font-devanagari-serif",
  subsets: ["devanagari", "latin"],
});

export const metadata: Metadata = {
  title: strings.appName,
  description: "व्यक्तिगत फ़ीड — नवभारत टाइम्स",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="hi"
      className={`${notoSansDevanagari.variable} ${notoSerifDevanagari.variable} h-full antialiased`}
    >
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col bg-background text-on-background">
        <div className="w-full max-w-[420px] mx-auto md:max-w-none md:border-x border-outline-variant/40 flex flex-col flex-1 min-h-full">
          {children}
        </div>
      </body>
    </html>
  );
}
