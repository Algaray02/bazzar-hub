"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Search,
  TrendingUp,
  Sparkles,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useBlogs } from "@/hooks/use-blogs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { POST_CATEGORIES } from "@/constant/category-post";
import { PostCard } from "@/components/shared/card/post-card";
import { PageLoader } from "@/components/ui/page-loader";
import { PageError } from "@/components/ui/page-error";

const BlogPage = () => {
  const [activeCategory, setActiveCategory] = useState("ALL");

  const { data: blogsData, isLoading, error } = useBlogs({
    publishedOnly: true,
    category: activeCategory !== "ALL" ? activeCategory : undefined,
  });

  if (isLoading) {
    return <PageLoader message="Loading blog posts..." />;
  }

  if (error) {
    return <PageError message={error.message} />;
  }

  const posts = blogsData?.data || [];
  const featuredPost = posts.find((post) => post.featured);
  const regularPosts = posts.filter((post) => !post.featured);

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-100 font-sans selection:bg-fuchsia-500/30">
      <section className="pt-32 pb-12 px-6 relative overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-fuchsia-600/10 blur-[150px] rounded-full pointer-events-none" />
        <div className="container mx-auto text-center space-y-4 relative z-10">
          <Badge
            variant="outline"
            className="border-fuchsia-500/50 text-fuchsia-400 mb-2"
          >
            <Sparkles className="w-3 h-3 mr-2" /> BazarHub Blog
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-white">
            Wawasan & Cerita <span className="text-fuchsia-500">Komunitas</span>
          </h1>
          <p className="text-zinc-400 max-w-2xl mx-auto">
            Dapatkan tips bisnis terbaru, inspirasi tenant sukses, dan highlight
            event terkini langsung dari ahlinya.
          </p>
        </div>
      </section>

      <main className="container mx-auto px-6 pb-24">
        {featuredPost && activeCategory === "ALL" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-16"
          >
            <div className="group relative rounded-3xl overflow-hidden border border-white/10 bg-[#0F0F11] hover:border-fuchsia-500/30 transition-all duration-500">
              <div className="grid md:grid-cols-2 gap-0">
                <div className="relative h-64 md:h-auto overflow-hidden">
                  <img
                    src={featuredPost.image || "/placeholder.svg"}
                    alt={featuredPost.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-fuchsia-600 hover:bg-fuchsia-700 border-none text-white">
                      Featured
                    </Badge>
                  </div>
                </div>
                <div className="p-8 md:p-12 flex flex-col justify-center space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 text-sm text-fuchsia-400 font-medium">
                      <TrendingUp className="w-4 h-4" />
                      {featuredPost.category}
                    </div>
                    <h2 className="text-2xl md:text-4xl font-bold text-white leading-tight group-hover:text-fuchsia-400 transition-colors">
                      {featuredPost.title}
                    </h2>
                    <p className="text-zinc-400 text-lg line-clamp-3">
                      {featuredPost.excerpt}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-6 border-t border-white/5">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-10 h-10 border border-white/10">
                        <AvatarImage
                          src={featuredPost.avatar || "/placeholder.svg"}
                        />
                        <AvatarFallback>AU</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium text-white">
                          {featuredPost.author}
                        </p>
                        <p className="text-xs text-zinc-500">
                          {new Date(featuredPost.createdAt).toLocaleDateString(
                            "id-ID"
                          )}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      className="hidden md:flex text-white hover:text-fuchsia-400 hover:bg-white/5 group-hover:translate-x-1 transition-all"
                    >
                      Baca Selengkapnya <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-10 sticky top-24 z-20 bg-[#050505]/95 backdrop-blur-sm py-4 border-b border-white/5 md:border-none md:static">
          <Select value={activeCategory} onValueChange={setActiveCategory}>
            <SelectTrigger className="h-12 bg-[#0F0F11] border-white/10 text-zinc-300 focus:ring-fuchsia-500/50">
              <FileText className="w-4 h-4 mr-2 text-fuchsia-500" />
              <SelectValue placeholder="Pilih Kategori" />
            </SelectTrigger>
            <SelectContent className="bg-[#0F0F11] border-white/10 text-zinc-300">
              <SelectItem value="ALL">Semua Kategori</SelectItem>
              {POST_CATEGORIES.filter((c) => c.value !== "ALL").map((post) => (
                <SelectItem key={post.value} value={post.value}>
                  {post.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <Input
              placeholder="Cari artikel..."
              className="pl-9 bg-[#0F0F11] border-white/10 text-white focus-visible:ring-fuchsia-500"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {regularPosts.map((post, index) => (
            <PostCard key={post.id} post={post} index={index} />
          ))}
        </div>

        {regularPosts.length === 0 && (
          <div className="text-center py-20 text-zinc-500">
            Belum ada artikel untuk kategori ini.
          </div>
        )}

        <div className="mt-24 p-8 md:p-12 rounded-3xl bg-linear-to-r from-fuchsia-900/20 to-purple-900/20 border border-fuchsia-500/20 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-fuchsia-600/20 blur-[100px] pointer-events-none" />
          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <h2 className="text-3xl font-bold text-white">
              Jangan Ketinggalan Info Bazar!
            </h2>
            <p className="text-zinc-400">
              Berlangganan newsletter kami untuk mendapatkan update event
              mingguan dan tips bisnis eksklusif langsung ke inbox Anda.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Input
                placeholder="Masukkan alamat email Anda"
                className="h-12 bg-[#050505] border-white/10 text-white focus-visible:ring-fuchsia-500"
              />
              <Button className="h-12 px-8 bg-fuchsia-600 hover:bg-fuchsia-700 text-white font-bold">
                Berlangganan
              </Button>
            </div>
            <p className="text-xs text-zinc-500">
              No spam. Unsubscribe kapan saja.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default BlogPage;