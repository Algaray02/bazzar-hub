import { Download } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

export function QrDialog({ isOpen, type, code, dataUrl, onClose }) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-zinc-950 border-zinc-800 text-white sm:max-w-md w-[95vw] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-center text-xl sm:text-2xl font-bold">
            {type === "TIKET" ? "🎫 Tiket Masuk" : "🏪 QR Code Toko"}
          </DialogTitle>
          <DialogDescription className="text-center text-sm sm:text-base text-zinc-400 px-2">
            {type === "TIKET"
              ? "Tunjukkan QR ini di pintu masuk event"
              : "Cetak dan tempel di booth untuk ulasan pelanggan"}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center justify-center py-6 px-4 sm:p-8 space-y-4 sm:space-y-6">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-[280px] sm:w-72 aspect-square bg-white rounded-2xl p-4 sm:p-6 flex items-center justify-center shadow-2xl"
          >
            {dataUrl ? (
              <img
                src={dataUrl}
                alt="QR Code"
                className="w-full h-full object-contain"
              />
            ) : (
              <div className="animate-pulse bg-zinc-200 w-full h-full rounded-lg" />
            )}
          </motion.div>

          <div className="bg-zinc-900 px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl border border-zinc-800 max-w-full overflow-x-auto">
            <code className="text-fuchsia-400 font-mono text-base sm:text-xl font-bold whitespace-nowrap">
              {code}
            </code>
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2 sm:gap-3 sm:justify-center">
          <Button
            className="w-full sm:flex-1 bg-zinc-700 hover:bg-zinc-600 text-zinc-50 order-2 sm:order-1"
            onClick={onClose}
          >
            Tutup
          </Button>
          <Button className="w-full sm:flex-1 bg-linear-to-r from-fuchsia-600 to-purple-600 hover:from-fuchsia-500 hover:to-purple-500 order-1 sm:order-2">
            <Download className="w-4 h-4 mr-2" />
            Simpan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
