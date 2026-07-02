"use client";

import React, { useEffect, useRef, useState } from "react";
import { Camera, ArrowLeft } from "lucide-react";

interface UserInfo {
  id: string;
  username: string;
  nama_lengkap: string;
  role: string;
}

interface SelfieCaptureViewProps {
  user: UserInfo;
  nextStatus: "Hadir" | "Terlambat" | "Pulang";
  onCapture: (base64Image: string) => void;
  onCancel: () => void;
}

export default function SelfieCaptureView({
  user,
  nextStatus,
  onCapture,
  onCancel,
}: SelfieCaptureViewProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [cameraLoading, setCameraLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const startSelfieCamera = async () => {
    try {
      setCameraLoading(true);
      const constraints = {
        video: { facingMode: "user", width: { ideal: 1280 }, height: { ideal: 720 } },
      };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.setAttribute("playsinline", "true");
        await videoRef.current.play();
      }
    } catch (err) {
      console.error("Gagal membuka kamera selfie stasiun:", err);
    } finally {
      setCameraLoading(false);
    }
  };

  const stopSelfieCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  useEffect(() => {
    startSelfieCamera();
    return () => stopSelfieCamera();
  }, []);

  const handleCapture = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (video && canvas && !submitting) {
      setSubmitting(true);
      const ctx = canvas.getContext("2d");
      if (ctx) {
        canvas.width = 640;
        canvas.height = 480;

        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        const base64Image = canvas.toDataURL("image/jpeg", 0.8);
        onCapture(base64Image);
      } else {
        setSubmitting(false);
      }
    }
  };

  const getStatusConfig = () => {
    switch (nextStatus) {
      case "Hadir":
        return {
          label: "Masuk (Tepat Waktu)",
          bg: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
        };
      case "Terlambat":
        return {
          label: "Masuk (Terlambat)",
          bg: "bg-amber-500/10 text-amber-400 border-amber-500/30",
        };
      case "Pulang":
        return {
          label: "Pulang",
          bg: "bg-blue-500/10 text-blue-400 border-blue-500/30",
        };
    }
  };

  const statusConfig = getStatusConfig();

  return (
    <div className="absolute inset-0 w-full h-full bg-slate-950 flex items-center justify-center">
      {/* 1. Full Screen Video Feed */}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover z-0"
        muted
        playsInline
      />
      <canvas ref={canvasRef} className="hidden" />

      {/* Camera Loading Overlay */}
      {cameraLoading && (
        <div className="absolute inset-0 bg-slate-950 flex flex-col items-center justify-center z-20 gap-3">
          <div className="w-8 h-8 border-3 border-[#2AB0B2]/30 border-t-[#2AB0B2] rounded-full animate-spin" />
          <p className="text-xs text-slate-400 font-medium">Mempersiapkan kamera selfie...</p>
        </div>
      )}

      {/* 2. Face Guidance Oval Frame overlay */}
      {!cameraLoading && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/35 pointer-events-none">
          <div className="w-64 h-80 md:w-80 md:h-[380px] border-3 border-dashed border-white/35 rounded-full pointer-events-none flex items-center justify-center">
            <span className="text-[10px] text-white/50 font-bold uppercase tracking-widest bg-black/40 backdrop-blur-sm px-4 py-1.5 rounded-full">
              Posisikan Wajah Di Sini
            </span>
          </div>
        </div>
      )}

      {/* 3. Floating User Console & Trigger Buttons */}
      {!cameraLoading && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-md z-20 bg-slate-900/90 backdrop-blur-md p-6 rounded-3xl border border-slate-800 shadow-2xl flex flex-col gap-4 text-center">
          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none">
              Siswa / Karyawan Teridentifikasi
            </span>
            <h3 className="text-lg font-black text-white mt-1.5 truncate leading-none">
              {user.nama_lengkap}
            </h3>
            <div className="flex items-center justify-center gap-1.5 mt-2.5">
              <span className="text-[10px] font-bold bg-slate-800 text-slate-300 px-2.5 py-1 rounded-full border border-slate-700">
                {user.role === "student" ? "Siswa PKL" : "Karyawan"}
              </span>
              <span
                className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${statusConfig.bg}`}
              >
                {statusConfig.label}
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <button
              onClick={handleCapture}
              disabled={cameraLoading || submitting}
              className="flex items-center justify-center gap-2 w-full py-4 bg-[#2AB0B2] hover:bg-[#228e90] active:scale-[0.99] text-white font-bold rounded-2xl transition-all disabled:opacity-50 disabled:pointer-events-none shadow-lg shadow-[#2AB0B2]/20 text-sm"
            >
              {submitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Memproses Absensi...</span>
                </>
              ) : (
                <>
                  <Camera size={16} />
                  <span>Ambil Foto Selfie & Absen</span>
                </>
              )}
            </button>

            <button
              onClick={onCancel}
              disabled={submitting}
              className="flex items-center justify-center gap-1.5 w-full py-2.5 border border-slate-700 hover:bg-slate-800 active:scale-[0.99] text-slate-400 hover:text-white text-xs font-bold rounded-xl transition-all disabled:opacity-50"
            >
              <ArrowLeft size={13} />
              <span>Kembali ke Pindai QR</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
