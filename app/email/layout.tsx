import type { Metadata } from "next";
import { Inter } from "next/font/google";

export const metadata: Metadata = {
  title: "Loopey Email Dashboard",
  description: "Send emails to your waitlist subscribers",
};

export default function EmailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-[linear-gradient(to_right,_#0052d4,_#20bdff,_#6fb1fc)] bg-clip-text text-transparent">
            Loopey Email Dashboard
          </h1>
          <p className="text-gray-400 mt-2">
            Send updates and announcements to your waitlist subscribers
          </p>
        </div>
        {children}
      </div>
    </div>
  );
}
