"use client";

import { useState } from "react";
import { format } from "date-fns";
import {
  Plus,
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UpsertBlogDialog } from "@/components/shared/dialog/upsert-dialog-blog";
import { DeleteBlogDialog } from "@/components/shared/dialog/delete-dialog-blog";
import {
  useBlogs,
  useUpsertBlog,
  useDeleteBlog,
  usePublishBlog,
} from "@/hooks/use-blogs";

const AdminBlogsDisplay = ({ initialPosts = [] }) => {
  const { data: blogsData } = useBlogs(
    { publishedOnly: false, page: 1, limit: 50 },
    { initialData: { data: initialPosts } }
  );
  const posts = blogsData?.data || initialPosts;

  const upsertBlog = useUpsertBlog();
  const deleteBlog = useDeleteBlog();
  const publishBlog = usePublishBlog();

  const [searchQuery, setSearchQuery] = useState("");
  const [isUpsertOpen, setIsUpsertOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState(null);

  const filteredBlogs = posts.filter((blog) =>
    blog.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenCreate = () => {
    setSelectedBlog(null);
    setIsUpsertOpen(true);
  };

  const handleOpenEdit = (blog) => {
    setSelectedBlog(blog);
    setIsUpsertOpen(true);
  };

  const handleOpenDelete = (blog) => {
    setSelectedBlog(blog);
    setIsDeleteOpen(true);
  };

  const handleFormSubmit = async (formData) => {
    upsertBlog.mutate(formData, {
      onSuccess: () => {
        setIsUpsertOpen(false);
      },
    });
  };

  const handleDeleteConfirm = () => {
    if (!selectedBlog) return;

    deleteBlog.mutate(selectedBlog.id, {
      onSuccess: () => {
        setIsDeleteOpen(false);
      },
    });
  };

  const handleTogglePublish = (blog) => {
    publishBlog.mutate({ id: blog.id, published: !blog.published });
  };

  const isSubmitting = upsertBlog.isPending;

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">
            Manajemen Blog
          </h1>
          <p className="text-zinc-400 mt-1">
            Buat dan kelola artikel, berita, dan tips untuk pengguna.
          </p>
        </div>
        <Button
          onClick={handleOpenCreate}
          className="bg-linear-to-r from-fuchsia-600 to-pink-600 hover:shadow-[0_0_20px_rgba(217,70,239,0.3)] text-white border-none h-12 px-6 rounded-xl"
        >
          <Plus className="w-5 h-5 mr-2" /> Tulis Artikel
        </Button>
      </div>

      <Card className="bg-[#0F0F11] border-white/10 overflow-hidden shadow-xl py-6">
        <CardHeader className="border-b border-white/5 pb-4">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <Input
              placeholder="Cari judul artikel..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white/5 border-white/10 text-white focus-visible:ring-fuchsia-500/50"
            />
          </div>
        </CardHeader>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-white/5 border-b border-white/5">
              <TableRow className="border-b border-white/5 hover:bg-transparent">
                <TableHead className="text-zinc-400 font-medium pl-5">
                  Artikel
                </TableHead>
                <TableHead className="text-zinc-400 font-medium">
                  Kategori
                </TableHead>
                <TableHead className="text-zinc-400 font-medium">
                  Status
                </TableHead>
                <TableHead className="text-zinc-400 font-medium">
                  Penulis
                </TableHead>
                <TableHead className="text-zinc-400 font-medium">
                  Tanggal
                </TableHead>
                <TableHead className="text-zinc-400 font-medium text-right pr-5">
                  Aksi
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-white/5">
              {filteredBlogs.length > 0 ? (
                filteredBlogs.map((blog) => (
                  <TableRow
                    key={blog.id}
                    className="border-b border-white/5 hover:bg-white/5 transition-colors group"
                  >
                    <TableCell className="py-4 max-w-[300px] pl-5">
                      <div className="flex flex-col gap-1">
                        <span className="font-semibold text-white truncate">
                          {blog.title}
                        </span>
                        <span className="text-xs text-zinc-500 truncate">
                          /{blog.slug}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className="bg-white/5 border-white/10 text-zinc-300"
                      >
                        {blog.category}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={
                          blog.published
                            ? "bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20"
                            : "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20"
                        }
                      >
                        {blog.published ? "Published" : "Draft"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-zinc-300 text-sm">
                      {blog.author}
                    </TableCell>
                    <TableCell className="text-zinc-400 text-sm">
                      {format(new Date(blog.createdAt), "dd MMM yyyy")}
                    </TableCell>
                    <TableCell className="text-right pr-5">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-zinc-400 hover:text-white hover:bg-white/10"
                          >
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="bg-[#18181b] border-white/10 text-zinc-300"
                        >
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator className="bg-white/10" />
                          <DropdownMenuItem
                            className="hover:bg-white/10 cursor-pointer"
                            onClick={() => handleTogglePublish(blog)}
                            disabled={publishBlog.isPending}
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            {blog.published ? "Unpublish" : "Publish"}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="hover:bg-white/10 cursor-pointer"
                            onClick={() => handleOpenEdit(blog)}
                          >
                            <Edit className="w-4 h-4 mr-2" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="hover:bg-white/10 cursor-pointer text-red-400 focus:text-red-400 focus:bg-red-500/10"
                            onClick={() => handleOpenDelete(blog)}
                            disabled={deleteBlog.isPending}
                          >
                            <Trash2 className="w-4 h-4 mr-2" /> Hapus
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="h-24 text-center text-zinc-500"
                  >
                    <div className="flex flex-col items-center justify-center gap-2">
                      <FileText className="w-8 h-8 opacity-20" />
                      <p>Belum ada artikel yang dibuat.</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      <UpsertBlogDialog
        key={selectedBlog ? selectedBlog.id : "create-blog"}
        open={isUpsertOpen}
        onOpenChange={setIsUpsertOpen}
        onSubmit={handleFormSubmit}
        defaultValues={selectedBlog}
        isSubmitting={isSubmitting}
      />

      <DeleteBlogDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        onConfirm={handleDeleteConfirm}
        blogTitle={selectedBlog?.title}
        isPending={deleteBlog.isPending}
      />
    </>
  );
};

export default AdminBlogsDisplay;