"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Search, ChevronDown, Check, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { HIGHLIGHT_OPTIONS } from "@/constant/highlights";
import { CITIES_OPTIONS } from "@/constant/cities";
import { GuestEventCard } from "@/components/shared/card/event-card";

const EventsPageDisplay = ({ initialEvents }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [open, setOpen] = useState(false);
  const [filterType, setFilterType] = useState("ALL");
  const [filterHighlights, setFilterHighlights] = useState([]);
  const [filterCity, setFilterCity] = useState("ALL");
  const [highlightSearch, setHighlightSearch] = useState("");

  const toggleValue = (val) => {
    if (filterHighlights.includes(val)) {
      setFilterHighlights(filterHighlights.filter((v) => v !== val));
    } else {
      setFilterHighlights([...filterHighlights, val]);
    }
  };

  const filteredHighlights = HIGHLIGHT_OPTIONS.filter((item) =>
    item.label.toLowerCase().includes(highlightSearch.toLowerCase())
  );

  const filteredEvents = initialEvents.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesHighlight =
      filterHighlights.length === 0 ||
      filterHighlights.some((h) =>
        event.highlights
          ?.map((x) => x.toUpperCase().replace(/\s/g, "_"))
          .includes(h)
      );
    const matchesCity =
      filterCity === "ALL" ||
      event.city.toLowerCase() === filterCity.toLowerCase();
    const matchesType = filterType === "ALL" || event.type === filterType;

    return matchesSearch && matchesHighlight && matchesCity && matchesType;
  });

  return (
    <div className="min-h-screen bg-black text-zinc-100 font-sans selection:bg-fuchsia-500/30">
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-fuchsia-600/20 blur-[150px] animate-pulse pointer-events-none" />
        <div
          className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-600/15 blur-[120px] animate-pulse pointer-events-none"
          style={{ animationDelay: "1s" }}
        />

        <div className="container mx-auto relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto space-y-6"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
            >
              <Badge
                variant="outline"
                className="border-fuchsia-500/30 bg-fuchsia-950/30 text-fuchsia-400 px-5 py-2 text-sm font-medium backdrop-blur-sm shadow-lg shadow-fuchsia-500/10"
              >
                📅 Agenda & Jadwal
              </Badge>
            </motion.div>

            <motion.h1
              className="text-5xl md:text-7xl font-bold text-white tracking-tight leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              Jelajahi Event{" "}
              <span className="text-transparent bg-clip-text bg-linear-to-r from-fuchsia-500 via-purple-500 to-pink-500">
                Terpopuler.
              </span>
            </motion.h1>

            <motion.p
              className="text-zinc-400 text-lg md:text-xl max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Temukan berbagai bazar, festival musik, dan car free day seru di
              kotamu.
            </motion.p>

            <motion.div
              className="mt-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="relative flex flex-col md:flex-row gap-3 max-w-4xl mx-auto bg-linear-to-br from-zinc-900/50 via-black to-zinc-900/50 p-3 rounded-3xl border border-white/10 backdrop-blur-xl shadow-2xl shadow-black/50">
                <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-fuchsia-500/50 to-transparent" />

                <div className="relative flex-1 group">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500 group-focus-within:text-fuchsia-400 transition-colors duration-300" />
                  <Input
                    placeholder="Cari event favorit kamu..."
                    className="pl-12 h-14 bg-white/5 border-white/5 rounded-2xl text-white focus-visible:ring-2 focus-visible:ring-fuchsia-500/50 focus-visible:border-fuchsia-500/50 focus-visible:bg-white/10 placeholder:text-zinc-500 transition-all duration-300 hover:bg-white/8 hover:border-white/20"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                <div className="md:hidden h-px bg-white/10 w-full" />

                <div className="w-full md:w-[200px] md:ml-6 md:mt-3">
                  <Select value={filterCity} onValueChange={setFilterCity}>
                    <SelectTrigger className="h-14 bg-linear-to-br from-zinc-900/80 to-black border-white/10 rounded-2xl text-zinc-300 focus:ring-2 focus:ring-fuchsia-500/50 hover:border-fuchsia-500/30 transition-all duration-300">
                      <MapPin className="w-4 h-4 mr-2 text-fuchsia-500" />
                      <SelectValue placeholder="Pilih Kota" />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-950/95 backdrop-blur-xl border-white/10 text-zinc-300 rounded-2xl">
                      <SelectItem
                        value="ALL"
                        className="rounded-xl focus:bg-fuchsia-950/30 focus:text-fuchsia-300"
                      >
                        Semua Kota
                      </SelectItem>
                      {CITIES_OPTIONS.filter((c) => c.value !== "ALL").map(
                        (city) => (
                          <SelectItem
                            key={city.value}
                            value={city.value}
                            className="rounded-xl focus:bg-fuchsia-950/30 focus:text-fuchsia-300"
                          >
                            {city.label}
                          </SelectItem>
                        )
                      )}
                    </SelectContent>
                  </Select>
                </div>

                <div className="w-full md:w-[200px]">
                  <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="group relative h-14 w-full bg-linear-to-br from-zinc-900 to-black border-white/10 rounded-2xl text-zinc-300 focus:ring-2 focus:ring-fuchsia-500/50 hover:border-fuchsia-500/30 transition-all duration-300 justify-between overflow-hidden"
                      >
                        <div className="relative flex items-center gap-2">
                          {filterHighlights.length > 0 && (
                            <div className="w-6 h-6 rounded-full bg-linear-to-br from-fuchsia-600 to-purple-600 flex items-center justify-center text-xs font-bold text-white shadow-lg shadow-fuchsia-500/30">
                              {filterHighlights.length}
                            </div>
                          )}
                          <span className="text-zinc-300 font-normal transition-colors">
                            {filterHighlights.length === 0
                              ? "Pilih Highlight"
                              : "dipilih"}
                          </span>
                        </div>
                        <ChevronDown
                          className={`relative w-5 h-5 transition-all duration-300 group-hover:text-fuchsia-400 ${
                            open
                              ? "rotate-180 text-fuchsia-500"
                              : "text-zinc-500"
                          }`}
                        />
                      </Button>
                    </PopoverTrigger>

                    <PopoverContent className="w-[340px] p-0 bg-linear-to-br from-zinc-950/98 via-black to-zinc-950/98 border-white/10 rounded-2xl shadow-2xl shadow-black/50 backdrop-blur-xl overflow-hidden">
                      <div className="absolute top-0 left-0 right-0 h-0.5 bg-linear-to-r from-transparent via-fuchsia-500/60 to-transparent" />

                      <div className="relative border-b border-white/10">
                        <Sparkles className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-fuchsia-500/60 pointer-events-none" />
                        <input
                          type="text"
                          placeholder="Cari highlight..."
                          value={highlightSearch}
                          onChange={(e) => setHighlightSearch(e.target.value)}
                          className="w-full h-14 pl-11 pr-4 bg-white/3 border-none text-zinc-300 placeholder:text-zinc-600 focus:bg-white/5 focus:outline-none transition-colors"
                        />
                      </div>

                      <div className="max-h-72 overflow-y-auto p-2 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/10 hover:scrollbar-thumb-white/20">
                        {filteredHighlights.length === 0 ? (
                          <div className="py-12 text-center">
                            <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-white/5 flex items-center justify-center">
                              <X className="w-8 h-8 text-zinc-600" />
                            </div>
                            <p className="text-zinc-500 text-sm">
                              Tidak ada hasil ditemukan
                            </p>
                          </div>
                        ) : (
                          <div className="space-y-1">
                            {filteredHighlights.map((item, index) => {
                              const isSelected = filterHighlights.includes(
                                item.value
                              );
                              return (
                                <div
                                  key={item.value}
                                  onClick={() => toggleValue(item.value)}
                                  className="group relative flex items-center gap-3 px-4 py-3.5 rounded-xl text-zinc-300 cursor-pointer transition-all duration-200 hover:bg-linear-to-r hover:from-fuchsia-950/40 hover:to-purple-950/40 hover:border-fuchsia-500/20"
                                  style={{
                                    animation: `slideIn 0.3s ease-out ${
                                      index * 0.05
                                    }s both`,
                                  }}
                                >
                                  {isSelected && (
                                    <div className="absolute inset-0 bg-linear-to-r from-fuchsia-600/10 via-purple-600/10 to-fuchsia-600/10 rounded-xl" />
                                  )}

                                  <div className="relative z-10">
                                    <Checkbox
                                      checked={isSelected}
                                      className={`w-5 h-5 rounded-lg border-2 transition-all duration-300 ${
                                        isSelected
                                          ? "bg-linear-to-br from-fuchsia-600 to-purple-600 border-fuchsia-500 shadow-lg shadow-fuchsia-500/30"
                                          : "border-white/20 bg-white/5 group-hover:border-fuchsia-400/40 group-hover:bg-white/10"
                                      }`}
                                    />
                                  </div>

                                  <span
                                    className={`relative z-10 flex-1 font-medium transition-all duration-200 ${
                                      isSelected
                                        ? "text-transparent bg-clip-text bg-linear-to-r from-fuchsia-300 to-purple-300"
                                        : "group-hover:text-zinc-100"
                                    }`}
                                  >
                                    {item.label}
                                  </span>

                                  {isSelected && (
                                    <div className="relative z-10 flex items-center gap-2">
                                      <div className="w-1.5 h-1.5 rounded-full bg-fuchsia-500 animate-pulse shadow-lg shadow-fuchsia-500/50" />
                                      <Check className="w-4 h-4 text-fuchsia-500" />
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>

                      {filterHighlights.length > 0 && (
                        <div className="p-3 border-t border-white/5 bg-white/2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 rounded-full bg-linear-to-r from-fuchsia-500 to-purple-500 animate-pulse" />
                              <span className="text-xs text-zinc-500 font-medium">
                                {filterHighlights.length} item terpilih
                              </span>
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setFilterHighlights([]);
                              }}
                              className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-fuchsia-600/20 border border-white/10 hover:border-fuchsia-500/30 transition-all duration-300"
                            >
                              <span className="text-xs font-medium text-zinc-400 hover:text-fuchsia-400 transition-colors">
                                Reset
                              </span>
                            </button>
                          </div>
                        </div>
                      )}

                      <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-purple-500/30 to-transparent" />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="container mx-auto px-6 pb-24">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">
              Event Mendatang
            </h2>
            <p className="text-zinc-500">
              {filteredEvents.length} event ditemukan
            </p>
          </div>

          <div className="w-full md:w-52">
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="h-12 bg-linear-to-br from-zinc-900/80 to-black border-white/10 rounded-xl text-zinc-300 focus:ring-2 focus:ring-fuchsia-500/50 hover:border-fuchsia-500/30 transition-all duration-300">
                <SelectValue placeholder="Kategori" />
              </SelectTrigger>
              <SelectContent className="bg-zinc-950/95 backdrop-blur-xl border-white/10 text-zinc-300 rounded-xl">
                <SelectItem
                  value="ALL"
                  className="rounded-lg focus:bg-fuchsia-950/30 focus:text-fuchsia-300"
                >
                  Semua Kategori
                </SelectItem>
                <SelectItem
                  value="WEEKLY"
                  className="rounded-lg focus:bg-fuchsia-950/30 focus:text-fuchsia-300"
                >
                  Mingguan (Rutin)
                </SelectItem>
                <SelectItem
                  value="SPECIAL"
                  className="rounded-lg focus:bg-fuchsia-950/30 focus:text-fuchsia-300"
                >
                  Special Event
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredEvents.map((event, index) => (
            <GuestEventCard key={event.id} event={event} index={index} />
          ))}
        </div>

        {filteredEvents.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-24 bg-linear-to-br from-zinc-900/30 to-black rounded-3xl border border-white/10 backdrop-blur-sm relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-linear-to-br from-fuchsia-900/5 to-purple-900/5" />

            <div className="relative z-10">
              <div className="w-20 h-20 bg-linear-to-br from-zinc-800 to-zinc-900 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
                <Search className="w-10 h-10 text-zinc-500" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">
                Event tidak ditemukan
              </h3>
              <p className="text-zinc-500 max-w-md mx-auto">
                Tidak ada event di kota atau kategori yang kamu pilih. Coba ubah
                filter pencarian.
              </p>
            </div>
          </motion.div>
        )}
      </section>
    </div>
  );
};

export default EventsPageDisplay;
