import { useEffect, useState } from "react";

export default function Topbar({ onMenuClick }) {
  const [dateTime, setDateTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setDateTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formattedDate = dateTime.toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const formattedTime = dateTime.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  return (
    <header className="mb-6 rounded-3xl bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onMenuClick}
            className="inline-flex h-11 w-11 items-center justify-center rounded-3xl bg-[#14B8A6] text-white transition hover:bg-[#0f9c8f] lg:hidden"
          >
            <span className="text-lg font-semibold">☰</span>
          </button>
          <div>
            <h1 className="mt-2 text-3xl font-semibold text-[#0f172a]">
              ReLoop Donation Platform
            </h1>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="rounded-3xl border border-[#14B8A6] bg-[#ecfdf5] px-4 py-3 shadow-sm">
            <div className="text-sm text-[#0f766e]">Tanggal:</div>
            <div className="ml-0 font-medium text-slate-900">
              {formattedDate}
            </div>
            <div className="mt-1 text-sm text-[#0f766e]">Waktu:</div>
            <div className="ml-0 font-medium text-slate-900">
              {formattedTime}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
