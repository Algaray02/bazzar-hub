"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { format } from "date-fns";
import {
  Sparkles,
  Filter,
  Search,
  MapPin,
  DollarSign,
  Check,
  RotateCcw,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Form } from "@/components/ui/form";
import { Card, CardContent } from "@/components/ui/card";

import { useEvents } from "@/hooks/use-events";
import { EventCard } from "@/components/shared/card/event-card";
import { HIGHLIGHT_OPTIONS } from "@/constant/highlights";
import { DateField } from "@/components/shared/form/date-field";

export function EventTab({ onBook }) {
  const [showFilters, setShowFilters] = useState(false);

  const form = useForm({
    defaultValues: {
      searchQuery: "",
      city: "all",
      priceRange: [0, 5000000],
      date: undefined,
      highlights: [],
    },
  });

  const filterValues = form.watch();
  const { setValue, reset, control } = form;

  const categories = [
    { value: "all", label: "Semua Event" },
    { value: "WEEKLY", label: "Mingguan" },
    { value: "SPECIAL", label: "Special Event" },
  ];

  const { data: eventsData = [], isLoading } = useEvents({ limit: 50 });
  const allEvents = eventsData || [];

  const cities = ["all", ...new Set(allEvents.map((e) => e.city))].filter(
    Boolean
  );

  const filteredEvents = allEvents.filter((event) => {
    if (
      filterValues.searchQuery &&
      !event.title
        .toLowerCase()
        .includes(filterValues.searchQuery.toLowerCase())
    ) {
      return false;
    }

    if (filterValues.city !== "all" && event.city !== filterValues.city) {
      return false;
    }

    const prices = event.booths?.map((b) => b.price) || [];
    const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
    if (
      minPrice < filterValues.priceRange[0] ||
      minPrice > filterValues.priceRange[1]
    ) {
      return false;
    }

    if (filterValues.date) {
      const filterDateStr = format(filterValues.date, "yyyy-MM-dd");
      const eventDateStr = new Date(event.date).toISOString().split("T")[0];
      if (eventDateStr !== filterDateStr) {
        return false;
      }
    }

    if (filterValues.highlights.length > 0) {
      const hasHighlight = filterValues.highlights.some((h) =>
        event.highlights?.includes(h)
      );
      if (!hasHighlight) {
        return false;
      }
    }

    return true;
  });

  const toggleHighlight = (highlightValue) => {
    const currentHighlights = filterValues.highlights;
    if (currentHighlights.includes(highlightValue)) {
      setValue(
        "highlights",
        currentHighlights.filter((h) => h !== highlightValue)
      );
    } else {
      setValue("highlights", [...currentHighlights, highlightValue]);
    }
  };

  const handleReset = () => {
    reset({
      searchQuery: "",
      city: "all",
      priceRange: [0, 5000000],
      date: undefined,
      highlights: [],
    });
  };

  return (
    <>
      <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-fuchsia-950/40 via-purple-950/40 to-zinc-950/40 border border-fuchsia-500/20 p-8 md:p-12 mb-8">
        <div className="absolute top-0 right-0 w-96 h-96 bg-fuchsia-500/10 rounded-full blur-3xl" />
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div className="space-y-4">
              <Badge className="bg-fuchsia-500/20 text-fuchsia-400 border-fuchsia-500/50">
                <Sparkles className="w-3 h-3 mr-1" />
                Discover Events
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold text-white">
                Temukan Event Terbaik
              </h2>
              <p className="text-zinc-400 max-w-2xl text-lg">
                Dari festival musik hingga pasar mingguan - pilih spot yang
                sempurna untuk bisnis Anda
              </p>
            </div>
            <Button
              size="lg"
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="border-fuchsia-500/30 text-fuchsia-100 bg-fuchsia-600 hover:bg-fuchsia-500 hover:text-white whitespace-nowrap transition-all"
            >
              <Filter className="w-4 h-4 mr-2" />
              {showFilters ? "Sembunyikan" : "Tampilkan"} Filter
            </Button>
          </div>
        </div>
      </div>

      <Form {...form}>
        <form className="space-y-6">
          <Card className="bg-zinc-900/50 border-zinc-800">
            <CardContent className="p-6">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                <Input
                  placeholder="Cari event berdasarkan nama..."
                  {...form.register("searchQuery")}
                  className="pl-12 h-12 bg-zinc-950 border-zinc-700 text-white focus:ring-fuchsia-500 focus:border-fuchsia-500 placeholder:text-zinc-600"
                />
              </div>
            </CardContent>
          </Card>

          {showFilters && (
            <Card className="bg-zinc-900/50 border-zinc-800 animate-in fade-in slide-in-from-top-4 duration-300">
              <CardContent className="p-6 space-y-8">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  <div className="space-y-3">
                    <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider flex items-center gap-2 ml-1">
                      <MapPin className="w-3.5 h-3.5 text-fuchsia-500" />
                      Kota
                    </label>
                    <Select
                      value={filterValues.city}
                      onValueChange={(val) => setValue("city", val)}
                    >
                      <SelectTrigger className="w-full pl-3 py-6 rounded-xl bg-black hover:bg-black/90 border-zinc-700 text-white">
                        <SelectValue placeholder="Pilih Kota" />
                      </SelectTrigger>
                      <SelectContent className="bg-zinc-900 border-zinc-800 text-zinc-300">
                        {cities.map((city) => (
                          <SelectItem key={city} value={city}>
                            {city === "all" ? "Semua Kota" : city}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <DateField
                      control={control}
                      name="date"
                      label="Tanggal Event"
                      placeholder="Pilih tanggal spesifik"
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider flex items-center gap-2 ml-1">
                      <DollarSign className="w-3.5 h-3.5 text-fuchsia-500" />
                      Range Harga
                    </label>
                    <div className="bg-black border border-zinc-700 rounded-xl p-4">
                      <div className="flex justify-between mb-4 text-sm text-zinc-300">
                        <span>
                          IDR {(filterValues.priceRange[0] / 1000).toFixed(0)}K
                        </span>
                        <span>
                          IDR {(filterValues.priceRange[1] / 1000).toFixed(0)}K
                        </span>
                      </div>
                      <Slider
                        value={filterValues.priceRange}
                        onValueChange={(val) => setValue("priceRange", val)}
                        min={0}
                        max={5000000}
                        step={100000}
                        className="cursor-pointer"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4 pt-4 border-t border-zinc-800/50">
                  <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider ml-1">
                    Highlight Event
                  </label>
                  <div className="flex flex-wrap gap-2.5">
                    {HIGHLIGHT_OPTIONS.map((highlight) => {
                      const isSelected = filterValues.highlights.includes(
                        highlight.value
                      );
                      return (
                        <div
                          key={highlight.value}
                          onClick={() => toggleHighlight(highlight.value)}
                          className={`
                                group relative flex items-center gap-2 px-4 py-2 rounded-full border text-sm cursor-pointer transition-all duration-300 select-none
                                ${
                                  isSelected
                                    ? "bg-fuchsia-900/40 border-fuchsia-500 text-white shadow-[0_0_15px_-3px_rgba(217,70,239,0.3)]"
                                    : "bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-600 hover:bg-zinc-900 hover:text-zinc-200"
                                }
                            `}
                        >
                          {isSelected && (
                            <span className="animate-in zoom-in duration-200">
                              <Check className="w-3.5 h-3.5 text-fuchsia-400" />
                            </span>
                          )}
                          {highlight.label}
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={handleReset}
                    className="text-zinc-500 hover:text-red-400 hover:bg-red-950/10 group transition-colors"
                  >
                    <RotateCcw className="w-4 h-4 mr-2 group-hover:-rotate-180 transition-transform duration-500" />
                    Reset Filter
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </form>
      </Form>

      {isLoading ? (
        <div className="text-center py-20">
          <div className="animate-spin w-8 h-8 border-2 border-fuchsia-500 border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-zinc-500">Memuat event terbaik untuk Anda...</p>
        </div>
      ) : (
        <Tabs defaultValue="all" className="w-full mt-8">
          <TabsList className="bg-zinc-900/50 border border-zinc-800/50 p-1 w-full md:w-auto inline-flex">
            {categories.map((cat) => (
              <TabsTrigger
                key={cat.value}
                value={cat.value}
                className="flex-1 md:flex-none data-[state=active]:bg-linear-to-r data-[state=active]:from-fuchsia-600 data-[state=active]:to-purple-600 data-[state=active]:text-white rounded-lg px-6 text-zinc-400 hover:text-zinc-300 transition-all capitalize font-medium"
              >
                {cat.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {categories.map((cat) => (
            <TabsContent
              key={cat.value}
              value={cat.value}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500"
            >
              {filteredEvents
                .filter((e) => cat.value === "all" || e.type === cat.value)
                .map((event, index) => (
                  <EventCard
                    key={event.id}
                    event={event}
                    index={index}
                    onBook={onBook}
                  />
                ))}
            </TabsContent>
          ))}
        </Tabs>
      )}

      {!isLoading && filteredEvents.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed border-zinc-800 rounded-3xl mt-8">
          <div className="w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center mb-4">
            <X className="w-8 h-8 text-zinc-600" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">
            Tidak ada event ditemukan
          </h3>
          <p className="text-zinc-500 max-w-sm mx-auto mb-6">
            Kami tidak dapat menemukan event yang sesuai dengan filter Anda.
            Coba kurangi filter atau cari kata kunci lain.
          </p>
          <Button
            variant="outline"
            onClick={handleReset}
            className="border-zinc-700 text-zinc-300"
          >
            Hapus Semua Filter
          </Button>
        </div>
      )}
    </>
  );
}