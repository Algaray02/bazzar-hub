import {
  ArrowRight,
  Calendar,
  Clock,
  Eye,
  Heart,
  MessageCircle,
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getCategoryPost } from "@/constant/category-post";

export const PostCard = ({ post, index }) => {
  return (
    <motion.div
      key={post.id}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      viewport={{ once: true }}
      whileHover={{ y: -8 }}
      className="h-full"
    >
      <Card className="bg-[#0F0F11]/80 backdrop-blur-xl border-white/10 overflow-hidden hover:border-fuchsia-500/50 transition-all duration-500 group h-full flex flex-col relative shadow-xl hover:shadow-2xl hover:shadow-fuchsia-500/10">
        <motion.div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{
            background:
              "linear-gradient(135deg, rgba(192, 38, 211, 0.03) 0%, rgba(219, 39, 119, 0.03) 50%, rgba(225, 29, 72, 0.03) 100%)",
          }}
        />

        <div className="relative h-56 overflow-hidden">
          <motion.img
            src={post.image}
            alt={post.title}
            className="w-full h-full object-cover"
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />

          <div className="absolute inset-0 bg-linear-to-t from-[#0F0F11] via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />

          <motion.div
            initial={{ x: -20, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 + index * 0.1 }}
            className="absolute top-4 left-4 z-10"
          >
            <Badge className="bg-linear-to-r from-fuchsia-600/90 to-pink-600/90 backdrop-blur-md text-white border-none shadow-lg hover:from-fuchsia-500 hover:to-pink-500 transition-all duration-300 px-3 py-1">
              {getCategoryPost(post.category)}
            </Badge>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
            className="absolute bottom-4 right-4 flex items-center gap-3 z-10"
          >
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10">
              <Eye className="w-3.5 h-3.5 text-zinc-400" />
              <span className="text-xs font-medium text-white">
                {post.views || "1.2k"}
              </span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10">
              <Heart className="w-3.5 h-3.5 text-red-400" />
              <span className="text-xs font-medium text-white">
                {post.likes || "234"}
              </span>
            </div>
          </motion.div>
        </div>

        <CardHeader className="space-y-4 flex-1 p-6 relative z-10">
          <div className="flex items-center gap-3 text-xs text-zinc-500">
            <div className="flex items-center gap-1.5">
              <div className="p-1 rounded bg-fuchsia-500/10 border border-fuchsia-500/20">
                <Calendar className="w-3 h-3 text-fuchsia-400" />
              </div>
              <span>
                {post.createdAt.toLocaleString("id-ID", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </div>
            <span className="text-zinc-700">•</span>
            <div className="flex items-center gap-1.5">
              <div className="p-1 rounded bg-fuchsia-500/10 border border-fuchsia-500/20">
                <Clock className="w-3 h-3 text-fuchsia-400" />
              </div>
              <span>
                {post.createdAt.toLocaleString("id-ID", {
                  hour: "numeric",
                  minute: "numeric",
                })}
              </span>
            </div>
          </div>

          <h3 className="text-xl font-bold text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-linear-to-r group-hover:from-fuchsia-400 group-hover:to-pink-400 transition-all duration-300 line-clamp-2 leading-tight">
            {post.title}
          </h3>

          <p className="text-zinc-400 text-sm leading-relaxed line-clamp-3">
            {post.excerpt}
          </p>

          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-2">
              {post.tags.slice(0, 3).map((tag, i) => (
                <span
                  key={i}
                  className="text-xs px-2 py-1 rounded-full bg-white/5 text-zinc-500 border border-white/5 hover:border-fuchsia-500/30 hover:text-fuchsia-400 transition-colors"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </CardHeader>

        <CardFooter className="pt-0 pb-6 px-6 relative z-10">
          <div className="flex items-center justify-between w-full border-t border-white/5 pt-4">
            <div className="flex items-center gap-3">
              <motion.div whileHover={{ scale: 1.1 }} className="relative">
                <div className="absolute inset-0 rounded-full bg-linear-to-br from-fuchsia-500/30 to-pink-500/30 blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
                <Avatar className="w-10 h-10 border-2 border-white/10 relative">
                  <AvatarImage src={post.author.avatar} />
                  <AvatarFallback className="bg-linear-to-br from-fuchsia-600 to-pink-600 text-white font-bold">
                    {post.author?.charAt(0) || "A"}
                  </AvatarFallback>
                </Avatar>
              </motion.div>
              <div>
                <p className="text-sm font-semibold text-white group-hover:text-fuchsia-400 transition-colors">
                  {post.author}
                </p>
                <p className="text-xs text-zinc-500">
                  {post.author.role || "Author"}
                </p>
              </div>
            </div>

            <motion.div whileHover={{ x: 5 }} whileTap={{ scale: 0.95 }}>
              <Link
                href={`/blogs/${post.slug}`}
                className="flex items-center justify-center rounded-full p-4 bg-transparent border border-white/10 text-zinc-400 transition-all duration-300 group-hover:bg-fuchsia-500/10 group-hover:border-fuchsia-500/50 group-hover:text-fuchsia-400 shadow-lg"
              >
                <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </div>
        </CardFooter>

        <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-br from-fuchsia-600/5 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      </Card>
    </motion.div>
  );
};
