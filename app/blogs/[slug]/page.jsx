"use client";

import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Share2,
  Facebook,
  Twitter,
  Linkedin,
  Tag,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useBlog, useBlogs } from "@/hooks/use-blogs";
import { getCategoryPost } from "@/constant/category-post";
import { PageLoader } from "@/components/ui/page-loader";

export default function BlogDetailPage() {
  const params = useParams();
  const router = useRouter();

  const { data: post, isLoading, error } = useBlog(params.slug);
  const { data: blogsData } = useBlogs({ publishedOnly: true, limit: 10 });

  if (isLoading) {
    return <PageLoader message="Loading blog post..." />;
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-zinc-500 gap-4">
        <p>Artikel tidak ditemukan.</p>
        <Button variant="outline" onClick={() => router.push("/blogs")}>
          Kembali ke Blog
        </Button>
      </div>
    );
  }

  const allPosts = blogsData?.data || [];
  const relatedPosts = allPosts
    .filter((b) => b.category === post.category && b.id !== post.id)
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-100 font-sans selection:bg-fuchsia-500/30">
      <div className="pt-32 pb-12 px-6 container mx-auto max-w-5xl">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-8 text-zinc-400 hover:text-white pl-0 hover:bg-transparent group"
        >
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Kembali
        </Button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6 text-center md:text-left"
        >
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
            <Badge className="bg-fuchsia-600 hover:bg-fuchsia-700 border-none px-3 py-1">
              {getCategoryPost(post.category)}
            </Badge>
            <span className="text-zinc-500 text-sm flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {format(new Date(post.createdAt), "dd MMMM yyyy")}
            </span>
            <span className="text-zinc-500 text-sm flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {format(new Date(post.createdAt), "HH:mm")}
            </span>
          </div>

          <h1 className="text-3xl md:text-5xl font-bold text-white leading-tight">
            {post.title}
          </h1>

          <div className="flex items-center justify-center md:justify-start gap-4 pt-2">
            <Avatar className="w-10 h-10 border border-white/10">
              <AvatarImage src={post.avatar || "/placeholder.svg"} />
              <AvatarFallback>AU</AvatarFallback>
            </Avatar>
            <div className="text-left">
              <p className="text-sm font-medium text-white">{post.author}</p>
              <p className="text-xs text-zinc-500">{post.slug}</p>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="w-full h-[400px] md:h-[500px] relative overflow-hidden bg-zinc-900">
        <motion.img
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5 }}
          src={post.image}
          alt={post.title}
          className="w-full h-full object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-linear-to-t from-[#050505] via-transparent to-transparent" />
      </div>

      <main className="container mx-auto px-6 py-12 max-w-5xl">
        <div className="grid lg:grid-cols-12 gap-12">
          <div className="lg:col-span-8">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="prose prose-invert prose-lg max-w-none text-zinc-300 leading-relaxed"
            >
              <div className="text-xl font-medium text-white mb-8 border-l-4 border-fuchsia-500 pl-4 italic">
                {post.excerpt}
              </div>

              <div
                dangerouslySetInnerHTML={{ __html: post.content }}
                className="space-y-6 [&>p]:mb-6 [&>h2]:text-2xl [&>h2]:font-bold [&>h2]:text-white [&>h2]:mt-8 [&>h2]:mb-4 [&>ul]:list-disc [&>ul]:pl-5 [&>li]:mb-2"
              />
            </motion.div>

            <Separator className="my-12 bg-white/10" />

            <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-2">
                <span className="text-sm text-zinc-500 font-medium">Tags:</span>
                <div className="flex gap-2">
                  {["Bisnis", "UMKM", "Tips"].map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="bg-zinc-800 text-zinc-400 hover:text-white cursor-pointer"
                    >
                      #{tag}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm text-zinc-500 font-medium">
                  Share:
                </span>
                <Button
                  size="icon"
                  variant="outline"
                  className="rounded-full w-8 h-8 bg-white/10 border-white/10 hover:bg-white/10 hover:text-blue-400"
                >
                  <Facebook className="w-4 h-4" />
                </Button>
                <Button
                  size="icon"
                  variant="outline"
                  className="rounded-full w-8 h-8 bg-white/10 border-white/10 hover:bg-white/10 hover:text-sky-400"
                >
                  <Twitter className="w-4 h-4" />
                </Button>
                <Button
                  size="icon"
                  variant="outline"
                  className="rounded-full w-8 h-8 bg-white/10 border-white/10 hover:bg-white/10 hover:text-blue-400"
                >
                  <Linkedin className="w-4 h-4" />
                </Button>
                <Button
                  size="icon"
                  variant="outline"
                  className="rounded-full w-8 h-8 bg-white/10 border-white/10 hover:bg-white/10 hover:text-zinc-400"
                >
                  <Share2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-8">
            <div>
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Tag className="w-4 h-4 text-fuchsia-500" /> Artikel Terkait
              </h3>
              <div className="space-y-4">
                {relatedPosts.length > 0 ? (
                  relatedPosts.map((related) => (
                    <Link
                      href={`/blogs/${related.slug}`}
                      key={related.id}
                      className="group block"
                    >
                      <div className="flex gap-4 items-start">
                        <div className="w-20 h-20 rounded-lg bg-zinc-800 overflow-hidden shrink-0">
                          <img
                            src={related.image || "/placeholder.svg"}
                            alt={related.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-white line-clamp-2 group-hover:text-fuchsia-400 transition-colors">
                            {related.title}
                          </h4>
                          <span className="text-xs text-zinc-500 mt-1 block">
                            {format(new Date(related.createdAt), "dd MMM yyyy")}
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))
                ) : (
                  <p className="text-sm text-zinc-500 italic">
                    Belum ada artikel terkait.
                  </p>
                )}
              </div>
            </div>

            <div className="rounded-xl overflow-hidden relative h-64 group cursor-pointer">
              <img
                src="https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&q=80"
                className="w-full h-full object-cover"
                alt="Ad"
              />
              <div className="absolute inset-0 bg-black/60 group-hover:bg-black/50 transition-colors flex flex-col items-center justify-center text-center p-6">
                <p className="text-fuchsia-400 font-bold text-sm tracking-widest uppercase mb-2">
                  BazarHub Event
                </p>
                <h3 className="text-2xl font-bold text-white mb-4">
                  Ingin Jualan Laris?
                </h3>
                <Button
                  variant="outline"
                  onClick={() => router.push("/auth/register")}
                  className="border-white text-zinc-900 hover:bg-white/90 hover:text-black"
                >
                  Daftar Tenant <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
