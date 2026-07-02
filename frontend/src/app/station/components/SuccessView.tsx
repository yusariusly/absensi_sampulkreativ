"use client";

import React, { useEffect, useState } from "react";
import { Check } from "lucide-react";

interface SuccessViewProps {
  userName: string;
  status: "Hadir" | "Terlambat" | "Pulang";
  onFinish: () => void;
}

export default function SuccessView({ userName, status, onFinish }: SuccessViewProps) {
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onFinish();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [onFinish]);

  const getStatusMessage = () => {
    switch (status) {
      case "Hadir":
        return "Absen Masuk Berhasil (Tepat Waktu)";
      case "Terlambat":
        return "Absen Masuk Berhasil (Terlambat)";
      case "Pulang":
        return "Absen Pulang Berhasil";
    }
  };

  return (
    <div className="flex flex-col items-center justify-center text-center p-8 bg-slate-900 rounded-2xl border border-slate-800 shadow-2xl w-full max-w-md mx-auto animate-scale-in">
      <div className="w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mb-6 animate-pulse">
        <div className="w-14 h-14 rounded-full bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/30">
          <Check size={28} className="text-white" strokeWidth={3} />
        </div>
      </div>

      <h3 className="text-xl font-bold text-white mb-2">Absensi Berhasil!</h3>
      <p className="text-sm text-[#2AB0B2] font-semibold mb-1">{userName}</p>
      <p className="text-xs text-slate-400 mb-6">{getStatusMessage()}</p>

      <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mb-3">
        <div
          className="bg-[#2AB0B2] h-full transition-all duration-1000 ease-linear"
          style={{ width: `${(countdown / 3) * 100}%` }}
        />
      </div>
      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
        Kembali ke mode pemindai dalam {countdown} detik
      </p>
    </div>
  );
}
