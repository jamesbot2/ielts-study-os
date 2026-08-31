import type { Metadata, Viewport } from "next";
import "./globals.css";
import { I18nProvider } from "@/components/i18n-provider";
import { StudyProfileProvider } from "@/components/study-profile-provider";
import { AiProvider } from "@/components/ai-provider";

export const metadata: Metadata = {
  title: "IELTS Study OS",
  description:
    "An independent, open-source IELTS learning platform: fundamentals, practice, AI coaching, mock exams and analytics.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <body className="min-h-full">
        <I18nProvider>
          <StudyProfileProvider>
            <AiProvider>{children}</AiProvider>
          </StudyProfileProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
