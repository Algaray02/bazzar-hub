"use client";

import { useState } from "react";
import { Plus, Trash2, Store, Grid3X3, List, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { GenerateBoothDialog } from "../shared/dialog/generate-dialog-booth";
import {
  generateBoothsAction,
  deleteBoothAction,
} from "@/app/actions/booth-actions";

export function BoothManager({ eventId, initialBooths }) {
  const [isGenerateOpen, setIsGenerateOpen] = useState(false);
  const [viewMode, setViewMode] = useState("grid");
  const [isLoading, setIsLoading] = useState(false);
  const [deletingBoothId, setDeletingBoothId] = useState(null);

  const handleGenerate = async (data) => {
    setIsLoading(true);

    try {
      const result = await generateBoothsAction({
        eventId,
        quantity: data.quantity,
        price: data.price,
      });

      if (result.success) {
        toast.success("Booths berhasil dibuat");
        setIsGenerateOpen(false);
      } else {
        toast.error(result.error || "Gagal membuat booth");
        console.error(result.error);
      }
    } catch (error) {
      toast.error("Terjadi kesalahan saat membuat booth");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (boothId) => {
    setDeletingBoothId(boothId);

    try {
      const result = await deleteBoothAction(boothId, eventId);

      if (result.success) {
        toast.success("Booth berhasil dihapus");
      } else {
        toast.error(result.error || "Gagal menghapus booth");
      }
    } catch (error) {
      toast.error("Terjadi kesalahan saat menghapus booth");
      console.error(error);
    } finally {
      setDeletingBoothId(null);
    }
  };

  const totalBooths = initialBooths.length;
  const bookedBooths = initialBooths.filter((b) => b.booking).length;
  const availableBooths = totalBooths - bookedBooths;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-4">
        <Card className="bg-[#0F0F11] border-white/10 hover:border-fuchsia-500/30 transition-colors">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-zinc-500 uppercase font-bold tracking-wider">
                Total Slot
              </p>
              <p className="text-2xl font-bold text-white mt-1">
                {totalBooths}
              </p>
            </div>
            <div className="p-2.5 bg-zinc-800/50 rounded-lg">
              <Store className="w-6 h-6 text-zinc-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#0F0F11] border-white/10 hover:border-emerald-500/30 transition-colors">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-zinc-500 uppercase font-bold tracking-wider">
                Terisi
              </p>
              <p className="text-2xl font-bold text-emerald-500 mt-1">
                {bookedBooths}
              </p>
            </div>
            <div className="relative">
              <div className="h-3 w-3 rounded-full bg-emerald-500" />
              <div className="absolute inset-0 h-3 w-3 rounded-full bg-emerald-500 animate-ping" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#0F0F11] border-white/10 hover:border-fuchsia-500/30 transition-colors">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-zinc-500 uppercase font-bold tracking-wider">
                Tersedia
              </p>
              <p className="text-2xl font-bold text-fuchsia-500 mt-1">
                {availableBooths}
              </p>
            </div>
            <div className="h-3 w-3 rounded-full bg-fuchsia-500 shadow-[0_0_10px_rgba(217,70,239,0.5)]" />
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 bg-[#0F0F11] p-1 rounded-lg border border-white/10">
          <Button
            variant={viewMode === "grid" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setViewMode("grid")}
            className={`h-8 w-8 p-0 transition-colors ${
              viewMode === "grid"
                ? "bg-fuchsia-500/20 text-fuchsia-400 hover:bg-fuchsia-500/30"
                : "text-zinc-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <Grid3X3 className="w-4 h-4" />
          </Button>
          <Button
            variant={viewMode === "list" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setViewMode("list")}
            className={`h-8 w-8 p-0 transition-colors ${
              viewMode === "list"
                ? "bg-fuchsia-500/20 text-fuchsia-400 hover:bg-fuchsia-500/30"
                : "text-zinc-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <List className="w-4 h-4" />
          </Button>
        </div>

        <Button
          onClick={() => setIsGenerateOpen(true)}
          className="bg-fuchsia-600 hover:bg-fuchsia-500 text-white shadow-[0_0_20px_rgba(217,70,239,0.3)] transition-all"
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Plus className="w-4 h-4 mr-2" />
          )}
          Generate Booth
        </Button>
      </div>

      <Card className="bg-[#0F0F11] border-white/10 min-h-[400px]">
        <CardContent className="p-6">
          {initialBooths.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-zinc-500">
              <div className="p-4 bg-fuchsia-500/5 rounded-full mb-4">
                <Store className="w-12 h-12 text-fuchsia-500/30" />
              </div>
              <p className="text-zinc-400 mb-2">
                Belum ada booth yang dibuat untuk event ini.
              </p>
              <Button
                variant="link"
                onClick={() => setIsGenerateOpen(true)}
                className="text-fuchsia-500 hover:text-fuchsia-400"
              >
                Generate sekarang
              </Button>
            </div>
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-3">
              {initialBooths.map((booth, index) => (
                <TooltipProvider key={booth.id}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div
                        className={`
                          aspect-square rounded-lg border-2 flex flex-col items-center justify-center cursor-pointer transition-all hover:scale-105 relative group
                          ${
                            booth.booking
                              ? "bg-emerald-900/20 border-emerald-500/30 text-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.2)]"
                              : "bg-zinc-900/50 border-zinc-800 text-zinc-400 hover:border-fuchsia-500 hover:text-fuchsia-400 hover:shadow-[0_0_15px_rgba(217,70,239,0.2)]"
                          }
                        `}
                      >
                        <span className="font-mono text-[10px] break-all px-1 text-center opacity-60">
                          {index + 1}
                        </span>
                        {!booth.booking && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(booth.id);
                            }}
                            className="absolute -top-2 -right-2 cursor-pointer bg-red-600 hover:bg-red-500 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={deletingBoothId === booth.id}
                          >
                            {deletingBoothId === booth.id ? (
                              <Loader2 className="w-3 h-3 text-white animate-spin" />
                            ) : (
                              <Trash2 className="w-3 h-3 text-white" />
                            )}
                          </button>
                        )}
                      </div>
                    </TooltipTrigger>
                    <TooltipContent className="bg-zinc-900 border-zinc-800 text-white">
                      <p className="font-bold text-xs font-mono">
                        {booth.code}
                      </p>
                      <p className="text-xs text-zinc-400">
                        {booth.booking ? "Booked" : "Available"}
                      </p>
                      <p className="text-xs text-fuchsia-400 font-medium">
                        Rp {booth.price.toLocaleString("id-ID")}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {initialBooths.map((booth, index) => (
                <div
                  key={booth.id}
                  className="flex items-center justify-between p-3 rounded-lg border border-white/5 bg-white/5 hover:bg-white/10 hover:border-fuchsia-500/30 transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className="size-12 rounded-lg bg-zinc-900 flex items-center justify-center font-bold text-white border border-white/10 text-xs font-mono">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium font-mono text-sm text-fuchsia-400">
                        {booth.code}
                      </p>
                      <p className="text-xs text-zinc-500">
                        Rp {booth.price.toLocaleString("id-ID")}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    {booth.booking ? (
                      <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 hover:bg-emerald-500/20">
                        Booked
                      </Badge>
                    ) : (
                      <Badge
                        variant="outline"
                        className="text-zinc-500 border-zinc-700 hover:text-zinc-400"
                      >
                        Available
                      </Badge>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(booth.id)}
                      disabled={!!booth.booking || deletingBoothId === booth.id}
                      className="bg-zinc-800/50 hover:bg-red-600/20 text-red-500 hover:text-red-400 border border-white/5 hover:border-red-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      {deletingBoothId === booth.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <GenerateBoothDialog
        open={isGenerateOpen}
        onOpenChange={setIsGenerateOpen}
        onGenerate={handleGenerate}
        isPending={isLoading}
      />
    </div>
  );
}