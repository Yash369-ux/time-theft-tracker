"use client";

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-black text-white">
      <h1 className="text-5xl font-bold mb-6">
        Time Theft Tracker
      </h1>

      <p className="text-xl text-gray-300 mb-8">
        Track where your time is silently stolen.
      </p>

      <button
        onClick={() => router.push("/dashboard")}
        className="bg-white text-black px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 transition"
      >
        Get Started
      </button>
    </main>
  );
}