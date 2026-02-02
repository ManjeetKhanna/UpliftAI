import React from "react";
import Staff from "./Staff.jsx";

export default function StaffPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-8">
      {/* Header */}
      <div className="mb-8 flex flex-col items-center text-center gap-2">
        <h1 className="text-4xl font-extrabold tracking-tight text-white">
          Staff Dashboard
        </h1>
        <p className="max-w-2xl text-sm text-slate-300">
          Anonymous sentiment, categories, and usage insights
        </p>
      </div>

      {/* Content */}
      <section
        className="
          rounded-2xl
          border border-white/10
          bg-white/[0.03]
          p-6
          shadow-[0_14px_40px_rgba(0,0,0,0.35)]
          backdrop-blur-[6px]
        "
      >
        <Staff />
      </section>
    </div>
  );
}
