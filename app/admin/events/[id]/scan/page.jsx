"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import jsQR from "jsqr";
import { toast } from "sonner";
import {
  QrCode,
  CheckCircle,
  XCircle,
  Camera,
  ArrowLeft,
  ScanLine,
  Zap,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useEvents } from "@/hooks/use-events";
import { checkInTicket } from "@/app/actions/scan-actions";

export default function AdminScanPage() {
  const params = useParams();
  const router = useRouter();
  const eventId = params.id;

  const [ticketCode, setTicketCode] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [scanHistory, setScanHistory] = useState([]);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const scanIntervalRef = useRef(null);
  const inputRef = useRef(null);

  const { data: events } = useEvents();
  const currentEvent = events?.find((e) => e.id === eventId);

  useEffect(() => {
    return () => stopScanner();
  }, []);

  const startScanner = async () => {
    try {
      setIsScanning(true);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.setAttribute("playsinline", true);
        await videoRef.current.play();

        scanIntervalRef.current = setInterval(tickScanner, 200);
      }
    } catch (err) {
      console.error("Camera Error:", err);
      toast.error("Gagal membuka kamera", {
        description: "Pastikan izin kamera diberikan.",
      });
      setIsScanning(false);
    }
  };

  const stopScanner = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
    }
    if (scanIntervalRef.current) clearInterval(scanIntervalRef.current);
    setIsScanning(false);
  };

  const tickScanner = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    if (video.readyState === video.HAVE_ENOUGH_DATA) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const code = jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: "dontInvert",
      });

      if (code && code.data) {
        handleScanProcess(code.data);
        stopScanner();
      }
    }
  };

  const handleScanProcess = useCallback(
    async (code) => {
      if (!code || isProcessing) return;

      setIsProcessing(true);
      setTicketCode(code);

      try {
        const result = await checkInTicket(code, eventId);

        const newHistory = {
          id: Date.now(),
          code: code,
          timestamp: new Date().toLocaleTimeString(),
          status: result.success ? "success" : "failed",
          message: result.success ? "Check-in Berhasil" : result.error,
          detail: result.data || null,
        };

        setScanHistory((prev) => [newHistory, ...prev]);

        if (result.success) {
          toast.success("Check-in Sukses!", {
            description: `${result.data.storeName} - Booth ${result.data.boothCode}`,
          });
        } else {
          toast.error("Gagal Check-in", {
            description: result.error,
          });
        }
      } catch (err) {
        toast.error("Error Sistem", {
          description: "Terjadi kesalahan jaringan.",
        });
      } finally {
        setIsProcessing(false);
        setTicketCode("");
        setTimeout(() => inputRef.current?.focus(), 100);
      }
    },
    [eventId, isProcessing]
  );

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (ticketCode.trim().length > 0) {
      handleScanProcess(ticketCode);
    }
  };

  return (
    <div className="min-h-screen bg-black text-zinc-100 p-4 md:p-8 font-sans">
      <div className="max-w-6xl mx-auto mb-8 flex flex-col md:flex-row justify-between gap-4">
        <div>
          <Button
            variant="ghost"
            className="text-zinc-500 hover:text-white p-0 h-auto mb-2"
            onClick={() => router.back()}
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Kembali
          </Button>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <ScanLine className="w-8 h-8 text-fuchsia-500" />
            Terminal Check-in
          </h1>
          <p className="text-zinc-400 mt-1">
            Event Aktif:{" "}
            <span className="text-white font-bold">
              {currentEvent?.title || "Memuat..."}
            </span>
          </p>
        </div>

        <div className="flex gap-4 bg-zinc-900/50 p-4 rounded-xl border border-white/10">
          <div className="text-center px-4">
            <div className="text-2xl font-bold text-emerald-500">
              {scanHistory.filter((h) => h.status === "success").length}
            </div>
            <div className="text-[10px] text-zinc-500 uppercase font-bold">
              Sukses
            </div>
          </div>
          <div className="w-px bg-white/10" />
          <div className="text-center px-4">
            <div className="text-2xl font-bold text-red-500">
              {scanHistory.filter((h) => h.status === "failed").length}
            </div>
            <div className="text-[10px] text-zinc-500 uppercase font-bold">
              Gagal
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <Card className="bg-[#0F0F11] border-white/10 overflow-hidden shadow-2xl">
            <div className="aspect-video bg-black relative flex items-center justify-center overflow-hidden border-b border-white/10">
              {isScanning ? (
                <>
                  <video
                    ref={videoRef}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <canvas ref={canvasRef} className="hidden" />

                  <div className="absolute inset-0 border-2 border-fuchsia-500/30 m-8 rounded-lg">
                    <motion.div
                      className="w-full h-1 bg-fuchsia-500 shadow-[0_0_20px_#d946ef]"
                      animate={{ top: ["0%", "100%", "0%"] }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      style={{ position: "absolute" }}
                    />
                  </div>
                  <div className="absolute bottom-4 left-0 right-0 text-center">
                    <Badge
                      variant="secondary"
                      className="bg-black/50 text-white backdrop-blur-md"
                    >
                      Arahkan kamera ke QR Code
                    </Badge>
                  </div>
                </>
              ) : (
                <div className="text-center opacity-50 space-y-3">
                  <Camera className="w-16 h-16 mx-auto text-zinc-600" />
                  <p className="text-sm font-mono tracking-widest text-zinc-500">
                    CAMERA OFFLINE
                  </p>
                </div>
              )}
            </div>

            <div className="p-4 bg-zinc-900/50 flex justify-center border-b border-white/10">
              {isScanning ? (
                <Button variant="destructive" onClick={stopScanner}>
                  <X className="w-4 h-4 mr-2" /> Matikan Kamera
                </Button>
              ) : (
                <Button
                  className="bg-fuchsia-600 hover:bg-fuchsia-700 text-white"
                  onClick={startScanner}
                >
                  <Camera className="w-4 h-4 mr-2" /> Buka Kamera
                </Button>
              )}
            </div>

            <div className="p-6 bg-zinc-900/30">
              <form onSubmit={handleManualSubmit} className="flex gap-3">
                <div className="relative flex-1">
                  <QrCode className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                  <Input
                    ref={inputRef}
                    value={ticketCode}
                    onChange={(e) => setTicketCode(e.target.value)}
                    placeholder="Scan barcode atau ketik kode..."
                    className="pl-10 h-12 bg-black border-white/10 text-white font-mono focus-visible:ring-fuchsia-500"
                    autoFocus
                    disabled={isProcessing}
                  />
                </div>
                <Button
                  type="submit"
                  size="lg"
                  disabled={!ticketCode || isProcessing}
                  className="bg-zinc-800 hover:bg-zinc-700"
                >
                  {isProcessing ? (
                    <span className="animate-spin">⏳</span>
                  ) : (
                    <Zap className="w-5 h-5" />
                  )}
                </Button>
              </form>
              <p className="text-center text-xs text-zinc-500 mt-3">
                Gunakan scanner USB atau ketik manual lalu tekan Enter
              </p>
            </div>
          </Card>
        </div>

        <div className="h-[600px] flex flex-col bg-[#0F0F11] border border-white/10 rounded-xl overflow-hidden">
          <div className="p-4 bg-white/5 border-b border-white/10 flex justify-between items-center">
            <h3 className="font-bold flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              Aktivitas Terbaru
            </h3>
            <Badge
              variant="outline"
              className="text-xs border-white/10 text-white"
            >
              Real-time
            </Badge>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
            <AnimatePresence mode="popLayout">
              {scanHistory.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-zinc-600 opacity-50">
                  <ScanLine className="w-12 h-12 mb-2" />
                  <p>Belum ada data scan</p>
                </div>
              )}

              {scanHistory.map((log) => (
                <motion.div
                  key={log.id}
                  layout
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`p-4 rounded-lg border flex gap-4 ${
                    log.status === "success"
                      ? "bg-emerald-950/20 border-emerald-500/30"
                      : "bg-red-950/20 border-red-500/30"
                  }`}
                >
                  <div
                    className={`mt-1 p-1 rounded-full shrink-0 ${
                      log.status === "success"
                        ? "bg-emerald-500/20 text-emerald-500"
                        : "bg-red-500/20 text-red-500"
                    }`}
                  >
                    {log.status === "success" ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      <XCircle className="w-5 h-5" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <h4
                        className={`font-bold text-sm ${
                          log.status === "success"
                            ? "text-emerald-400"
                            : "text-red-400"
                        }`}
                      >
                        {log.message}
                      </h4>
                      <span className="text-[10px] text-zinc-500 font-mono">
                        {log.timestamp}
                      </span>
                    </div>

                    {log.detail && (
                      <div className="mt-1">
                        <p className="text-white font-medium truncate">
                          {log.detail.storeName}
                        </p>
                        <p className="text-xs text-zinc-400">
                          Booth: {log.detail.boothCode} • Seller:{" "}
                          {log.detail.sellerName}
                        </p>
                      </div>
                    )}

                    <div className="mt-2 inline-flex items-center gap-2 px-2 py-1 rounded bg-black/40 border border-white/5">
                      <QrCode className="w-3 h-3 text-zinc-500" />
                      <span className="text-[10px] font-mono text-zinc-400">
                        {log.code}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
