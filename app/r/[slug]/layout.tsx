import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "15-Second Google Review Assistant",
  description: "Share your genuine experience in seconds with AI-assisted review drafting.",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
};

export default function ReviewAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-start antialiased selection:bg-blue-500/30 selection:text-blue-200">
      <main className="w-full max-w-lg mx-auto p-4 sm:p-6 min-h-screen flex flex-col justify-between">
        {children}
      </main>
    </div>
  );
}
