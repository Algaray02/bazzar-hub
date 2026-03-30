import {
  Calendar,
  MapPin,
  ArrowRight,
  Sparkles,
  Store,
  Info,
  Edit,
  Trash2,
  MoreHorizontal,
  TrendingUp,
  Users,
} from "lucide-react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Progress } from "@/components/ui/progress";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const AdminEventCard = ({ event, onEdit, onDelete, index }) => {
  const boothsTotal = event.booths?.length || 0;
  const bookedCount = event.booths?.filter((b) => b.booking)?.length || 0;
  const occupancy =
    boothsTotal > 0 ? Math.round((bookedCount / boothsTotal) * 100) : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4 }}
      className="h-full"
    >
      <Card className="group relative bg-linear-to-br from-zinc-900/90 via-zinc-900/95 to-black border-zinc-800/50 overflow-hidden hover:border-fuchsia-500/40 transition-all duration-500 h-full flex flex-col hover:shadow-xl hover:shadow-fuchsia-500/5">
        <div className="relative h-48 overflow-hidden">
          <motion.img
            src={
              event.image ||
              "https://images.unsplash.com/photo-1540575467063-178f50c2dff0?w=500&h=500&fit=crop"
            }
            alt={event.title}
            className="w-full h-full object-cover"
            whileHover={{ scale: 1.08 }}
            transition={{ duration: 0.6 }}
          />
          <div className="absolute inset-0 bg-linear-to-t from-zinc-900 via-zinc-900/20 to-transparent" />

          <div className="absolute top-3 left-3 right-3 flex justify-between items-start z-10">
            <Badge className="bg-fuchsia-600 hover:bg-fuchsia-500 text-white border-0 shadow-lg px-3 py-1">
              {event.type || "Event"}
            </Badge>

            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            >
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    size="icon"
                    variant="secondary"
                    className="h-9 w-9 rounded-full bg-black/60 backdrop-blur-md text-white hover:bg-black/80 border border-white/10"
                  >
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="bg-zinc-900 border-zinc-800 text-zinc-100"
                >
                  <DropdownMenuLabel className="text-zinc-400">
                    Actions
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-zinc-800" />
                  <DropdownMenuItem
                    onClick={() => onEdit(event)}
                    className="hover:bg-zinc-800 cursor-pointer focus:bg-zinc-800"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Event
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => onDelete(event)}
                    className="hover:bg-red-500/10 cursor-pointer text-red-400 focus:text-red-400 focus:bg-red-500/10"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Hapus Event
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </motion.div>
          </div>
        </div>

        <CardContent className="p-5 flex-1 flex flex-col relative">
          <h3 className="text-xl font-bold text-white mb-4 line-clamp-2 group-hover:text-fuchsia-400 transition-colors duration-300">
            {event.title}
          </h3>

          <div className="space-y-2.5 mb-5">
            <div className="flex items-center gap-2.5 text-zinc-400 text-sm">
              <div className="p-1.5 rounded-lg bg-fuchsia-500/10">
                <Calendar className="w-3.5 h-3.5 text-fuchsia-400" />
              </div>
              <span className="line-clamp-1">
                {new Date(event.date).toLocaleDateString("id-ID", {
                  dateStyle: "medium",
                })}
              </span>
            </div>
            <div className="flex items-center gap-2.5 text-zinc-400 text-sm">
              <div className="p-1.5 rounded-lg bg-purple-500/10">
                <MapPin className="w-3.5 h-3.5 text-purple-400" />
              </div>
              <span className="line-clamp-1">{event.location}</span>
            </div>
          </div>

          <div className="mt-auto">
            <div className="bg-linear-to-br from-zinc-800/50 to-zinc-900/50 p-4 rounded-xl border border-zinc-800/50 backdrop-blur-sm">
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-fuchsia-400" />
                  <span className="text-xs text-zinc-400 font-medium">
                    Occupancy Rate
                  </span>
                </div>
                <span
                  className={`text-lg font-bold ${
                    occupancy >= 80
                      ? "text-emerald-400"
                      : occupancy >= 50
                      ? "text-amber-400"
                      : "text-zinc-400"
                  }`}
                >
                  {occupancy}%
                </span>
              </div>

              <Progress
                value={occupancy}
                className="h-2 [&>div]:bg-linear-to-r [&>div]:from-fuchsia-400 [&>div]:via-purple-500 [&>div]:to-purple-700 mb-2"
              />

              <div className="flex items-baseline gap-1.5">
                <span className="text-lg font-bold text-white">
                  {bookedCount}
                </span>
                <span className="text-sm text-zinc-500">
                  / {boothsTotal} booths booked
                </span>
              </div>
            </div>
          </div>
        </CardContent>

        <CardFooter className="p-5 pt-0 flex gap-2">
          <Link href={`/admin/events/${event.id}`} className="flex-1">
            <Button className="w-full bg-linear-to-r from-fuchsia-600 to-purple-600 hover:from-fuchsia-500 hover:to-purple-500 text-white border-0 shadow-lg shadow-fuchsia-500/20">
              View Details
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
          <Button
            onClick={() => onEdit(event)}
            variant="outline"
            size="icon"
            className="bg-blue-500/10 border-blue-500/30 text-blue-400 hover:bg-blue-500/20 hover:border-blue-500/50"
          >
            <Edit className="w-4 h-4" />
          </Button>
          <Button
            onClick={() => onDelete(event)}
            variant="outline"
            size="icon"
            className="bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500/20 hover:border-red-500/50"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export const EventCard = ({ event, index, onBook }) => {
  const prices = event.booths.map((booth) => booth.price);
  const priceStartFrom = Math.min(...prices);

  const availableBoothsCount =
    event.booths?.filter((booth) => {
      if (!booth.booking) return true;
      return ["REJECTED", "CANCELLED"].includes(booth.booking.status);
    }).length || 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: index * 0.08,
        duration: 0.5,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      whileHover={{ y: -8 }}
      className="h-full"
    >
      <Card className="group relative bg-linear-to-br from-zinc-900 via-zinc-900/98 to-zinc-950 border-zinc-800/60 overflow-hidden hover:border-fuchsia-500/50 transition-all duration-500 h-full flex flex-col hover:shadow-2xl hover:shadow-fuchsia-500/10">
        <motion.div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
          initial={false}
        >
          <div className="absolute top-0 right-0 w-72 h-72 bg-linear-to-bl from-fuchsia-500/15 via-purple-500/10 to-transparent blur-3xl" />
        </motion.div>

        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute inset-0 bg-linear-to-r from-transparent via-white/5 to-transparent skew-x-12"
            initial={{ x: "-150%" }}
            whileHover={{ x: "150%" }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
          />
        </div>

        {event.type === "SPECIAL" && (
          <div className="absolute top-4 left-4 z-20">
            <Badge className="bg-linear-to-r from-fuchsia-600 via-fuchsia-500 to-purple-600 text-white border-0 shadow-lg px-3 py-1.5 animate-pulse">
              <Sparkles className="w-3.5 h-3.5 mr-1.5" />
              Featured
            </Badge>
          </div>
        )}

        <div className="relative h-52 overflow-hidden">
          <motion.img
            src={event.image}
            alt={event.title}
            className="w-full h-full object-cover"
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          />
          <div className="absolute inset-0 bg-linear-to-t from-zinc-900 via-transparent to-transparent" />

          <div className="absolute top-4 right-4 z-10">
            <Badge
              className={`${
                event.type === "SPECIAL"
                  ? "bg-fuchsia-600/95 hover:bg-fuchsia-600"
                  : "bg-purple-600/95 hover:bg-purple-600"
              } text-white border-0 backdrop-blur-md shadow-lg px-3 py-1`}
            >
              {event.type === "SPECIAL" ? "Special Event" : "Mingguan"}
            </Badge>
          </div>
        </div>

        <CardContent className="p-5 flex-1 flex flex-col relative z-10">
          <h3 className="text-lg font-bold text-white mb-4 line-clamp-2 leading-snug group-hover:text-fuchsia-400 transition-colors duration-300">
            {event.title}
          </h3>

          <div className="space-y-2.5 mb-5">
            <motion.div
              className="flex items-center gap-2.5 text-sm text-zinc-400 hover:text-zinc-300 transition-colors"
              whileHover={{ x: 3 }}
            >
              <div className="p-1.5 rounded-lg bg-fuchsia-500/10 border border-fuchsia-500/20">
                <Calendar className="w-3.5 h-3.5 text-fuchsia-400" />
              </div>
              <span className="line-clamp-1">
                {new Date(event.date).toLocaleDateString("id-ID", {
                  weekday: "short",
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </span>
            </motion.div>

            <motion.div
              className="flex items-center gap-2.5 text-sm text-zinc-400 hover:text-zinc-300 transition-colors"
              whileHover={{ x: 3 }}
            >
              <div className="p-1.5 rounded-lg bg-purple-500/10 border border-purple-500/20">
                <MapPin className="w-3.5 h-3.5 text-purple-400" />
              </div>
              <span className="line-clamp-1">{event.location}</span>
            </motion.div>
          </div>

          <div className="mt-auto pt-5 border-t border-zinc-800/80">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-zinc-500 mb-1 font-medium">
                  Mulai dari
                </p>
                <p className="text-2xl font-bold bg-linear-to-r from-fuchsia-400 via-fuchsia-300 to-purple-400 bg-clip-text text-transparent">
                  Rp {priceStartFrom.toLocaleString("id-ID")}
                </p>
              </div>

              {event.booths.length === 0 ? (
                <Button
                  size="sm"
                  disabled
                  className="bg-zinc-800 text-zinc-500 cursor-not-allowed hover:bg-zinc-800"
                >
                  Segera Hadir
                </Button>
              ) : availableBoothsCount > 0 ? (
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    size="sm"
                    onClick={() => onBook(event)}
                    className="bg-linear-to-r from-fuchsia-600 to-purple-600 hover:from-fuchsia-500 hover:to-purple-500 text-white border-0 shadow-lg shadow-fuchsia-500/25 hover:shadow-fuchsia-500/40 transition-all duration-300 px-5"
                  >
                    Book Now
                    <ArrowRight className="w-4 h-4 ml-1.5" />
                  </Button>
                </motion.div>
              ) : (
                <Button
                  size="sm"
                  disabled
                  className="bg-zinc-800 text-zinc-500 cursor-not-allowed hover:bg-zinc-800"
                >
                  Penuh
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export const GuestEventCard = ({ event, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.08, duration: 0.4 }}
    viewport={{ once: true }}
    className="h-full"
  >
    <Card className="group relative bg-linear-to-br from-zinc-900/95 to-zinc-950 border-zinc-800/50 overflow-hidden hover:border-fuchsia-500/40 transition-all duration-500 h-full flex flex-col hover:shadow-xl hover:shadow-fuchsia-500/10">
      <div className="relative h-52 overflow-hidden">
        <motion.img
          src={event.image}
          alt={event.title}
          className="w-full h-full object-cover"
          whileHover={{ scale: 1.08 }}
          transition={{ duration: 0.6 }}
        />
        <div className="absolute inset-0 bg-linear-to-t from-zinc-900 via-zinc-900/30 to-transparent" />

        <div className="absolute top-3 right-3">
          <Badge
            className={`${
              event.type === "SPECIAL"
                ? "bg-fuchsia-600 hover:bg-fuchsia-500"
                : "bg-blue-600 hover:bg-blue-500"
            } text-white border-0 shadow-lg px-3 py-1`}
          >
            {event.type === "SPECIAL" ? "Special" : "Mingguan"}
          </Badge>
        </div>
      </div>

      <CardContent className="p-5 flex-1 flex flex-col relative z-10">
        <div className="mb-4">
          <h3 className="text-xl font-bold text-white mb-2 group-hover:text-fuchsia-400 transition-colors duration-300 line-clamp-2">
            {event.title}
          </h3>
          <div className="flex items-center gap-2 text-zinc-400 text-sm">
            <div className="p-1 rounded-lg bg-zinc-800">
              <Store className="w-3.5 h-3.5" />
            </div>
            <span>by {event.organizer.name}</span>
          </div>
        </div>

        <p className="text-zinc-400 text-sm line-clamp-2 mb-4 leading-relaxed">
          {event.description}
        </p>

        <div className="space-y-2.5 mt-auto">
          <div className="flex items-center gap-2.5 text-sm text-zinc-300">
            <div className="p-1.5 rounded-lg bg-fuchsia-500/10">
              <Calendar className="w-3.5 h-3.5 text-fuchsia-400" />
            </div>
            <span className="line-clamp-1">
              {new Date(event.date).toLocaleDateString("id-ID", {
                weekday: "short",
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </span>
          </div>
          <div className="flex items-center gap-2.5 text-sm text-zinc-300">
            <div className="p-1.5 rounded-lg bg-purple-500/10">
              <MapPin className="w-3.5 h-3.5 text-purple-400" />
            </div>
            <span className="line-clamp-1">
              {event.location}, {event.city}
            </span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-5 pt-0 border-t border-zinc-800/50">
        <Link href={`/events/${event.id}`} className="w-full">
          <Button className="w-full bg-linear-to-r from-fuchsia-600 to-purple-600 hover:from-fuchsia-500 hover:to-purple-500 text-white border-0 shadow-lg shadow-fuchsia-500/20">
            Lihat Detail
            <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  </motion.div>
);
