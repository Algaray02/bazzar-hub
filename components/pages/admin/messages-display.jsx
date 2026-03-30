"use client";

import { useState } from "react";
import { format } from "date-fns";
import {
  Search,
  Mail,
  MailOpen,
  Archive,
  Trash2,
  MoreVertical,
  Reply,
  Inbox,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  useMessages,
  useUpdateMessageStatus,
  useDeleteMessage,
} from "@/hooks/use-messages";

const AdminMessagesDisplay = ({ initialMessages = [] }) => {
  const { data: messagesData } = useMessages(
    { page: 1, limit: 50 },
    { initialData: { data: initialMessages } }
  );
  const messages = messagesData?.data || initialMessages;

  const updateStatus = useUpdateMessageStatus();
  const deleteMessage = useDeleteMessage();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const filteredMessages = messages.filter(
    (msg) =>
      msg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      msg.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      msg.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const unreadCount = messages.filter((m) => m.status === "UNREAD").length;

  const handleOpenDetail = (message) => {
    setSelectedMessage(message);
    setIsDetailOpen(true);

    if (message.status === "UNREAD") {
      updateStatus.mutate({ messageId: message.id, status: "READ" });
    }
  };

  const handleDelete = (id) => {
    deleteMessage.mutate(id, {
      onSuccess: () => {
        setIsDetailOpen(false);
      },
    });
  };

  const handleMarkStatus = (id, status) => {
    updateStatus.mutate({ messageId: id, status });
  };

  return (
    <>
      <div className="flex items-center gap-2 mb-6">
        <Badge className="bg-fuchsia-500/10 text-fuchsia-400 border-fuchsia-500/20 px-3 py-1">
          {unreadCount} Pesan Baru
        </Badge>
      </div>

      <Card className="bg-[#0F0F11] border-white/10 h-[600px] py-6 flex flex-col overflow-hidden">
        <CardHeader className="border-b border-white/5 py-4 px-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <Input
              placeholder="Cari pengirim atau subjek..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-black/20 border-white/10 text-white focus-visible:ring-fuchsia-500/50"
            />
          </div>
        </CardHeader>

        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-full">
            <div className="divide-y divide-white/5">
              {filteredMessages.length > 0 ? (
                filteredMessages.map((msg) => (
                  <div
                    key={msg.id}
                    onClick={() => handleOpenDetail(msg)}
                    className={`
                      group flex items-start gap-4 p-4 cursor-pointer transition-all hover:bg-white/5
                      ${
                        msg.status === "UNREAD"
                          ? "bg-fuchsia-900/5 border-l-2 border-fuchsia-500"
                          : "border-l-2 border-transparent"
                      }
                    `}
                  >
                    <div
                      className={`
                        mt-1 p-2 rounded-full shrink-0
                        ${
                          msg.status === "UNREAD"
                            ? "bg-fuchsia-500/20 text-fuchsia-400"
                            : "bg-zinc-800 text-zinc-500"
                        }
                      `}
                    >
                      {msg.status === "UNREAD" ? (
                        <Mail className="w-5 h-5" />
                      ) : (
                        <MailOpen className="w-5 h-5" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-1">
                        <h4
                          className={`text-sm truncate pr-2 ${
                            msg.status === "UNREAD"
                              ? "font-bold text-white"
                              : "font-medium text-zinc-300"
                          }`}
                        >
                          {msg.name}
                        </h4>
                        <span className="text-xs text-zinc-500 whitespace-nowrap">
                          {format(new Date(msg.createdAt), "dd MMM")}
                        </span>
                      </div>
                      <p
                        className={`text-sm mb-1 truncate ${
                          msg.status === "UNREAD"
                            ? "text-zinc-200"
                            : "text-zinc-400"
                        }`}
                      >
                        {msg.subject}
                      </p>
                      <p className="text-xs text-zinc-500 line-clamp-1">
                        {msg.message}
                      </p>
                    </div>

                    <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 hover:bg-white/20 text-zinc-400 hover:text-white"
                            onClick={(e) => e.stopPropagation()}
                            disabled={
                              updateStatus.isPending || deleteMessage.isPending
                            }
                          >
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="bg-[#18181b] border-white/10 text-zinc-300"
                        >
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation();
                              handleMarkStatus(
                                msg.id,
                                msg.status === "UNREAD" ? "READ" : "UNREAD"
                              );
                            }}
                          >
                            {msg.status === "UNREAD"
                              ? "Tandai Sudah Dibaca"
                              : "Tandai Belum Dibaca"}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(msg.id);
                            }}
                            className="text-red-400 focus:text-red-400"
                          >
                            Hapus Pesan
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center h-64 text-zinc-500">
                  <Inbox className="w-12 h-12 mb-4 opacity-20" />
                  <p>Tidak ada pesan ditemukan.</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      </Card>

      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="bg-[#0F0F11] border-white/10 text-white sm:max-w-2xl">
          <DialogHeader>
            <div className="flex items-center justify-between mb-2">
              <DialogTitle className="text-xl font-bold">
                Detail Pesan
              </DialogTitle>
              <div className="flex gap-2">
                {selectedMessage?.status === "ARCHIVED" && (
                  <Badge variant="secondary">Archived</Badge>
                )}
                <span className="text-xs text-zinc-500 mt-1.5">
                  {selectedMessage &&
                    format(
                      new Date(selectedMessage.createdAt),
                      "dd MMMM yyyy, HH:mm"
                    )}
                </span>
              </div>
            </div>
            <DialogDescription className="hidden">
              Read message content
            </DialogDescription>
          </DialogHeader>

          {selectedMessage && (
            <div className="space-y-6">
              <div className="bg-white/5 rounded-xl p-4 border border-white/5 space-y-3">
                <div className="grid grid-cols-[80px_1fr] gap-2 text-sm">
                  <span className="text-zinc-500">Dari:</span>
                  <span className="font-medium text-white">
                    {selectedMessage.name} &lt;{selectedMessage.email}&gt;
                  </span>
                </div>
                <div className="grid grid-cols-[80px_1fr] gap-2 text-sm">
                  <span className="text-zinc-500">Subjek:</span>
                  <span className="font-medium text-fuchsia-400">
                    {selectedMessage.subject}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">
                  Isi Pesan
                </h4>
                <ScrollArea className="h-[200px] w-full rounded-md border border-white/10 bg-black/20 p-4 text-sm leading-relaxed text-zinc-300">
                  {selectedMessage.message}
                </ScrollArea>
              </div>
            </div>
          )}

          <DialogFooter className="gap-2 sm:justify-between">
            <Button
              variant="ghost"
              onClick={() => handleDelete(selectedMessage?.id)}
              className="text-red-400 hover:text-red-300 hover:bg-red-900/10"
              disabled={deleteMessage.isPending}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Hapus
            </Button>
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="border-white/10 hover:bg-white/80 text-zinc-600 bg-transparent"
                onClick={() =>
                  handleMarkStatus(selectedMessage?.id, "ARCHIVED")
                }
                disabled={updateStatus.isPending}
              >
                <Archive className="w-4 h-4 mr-2" />
                Arsipkan
              </Button>
              <Button
                className="bg-fuchsia-600 hover:bg-fuchsia-700 text-white"
                onClick={() =>
                  (window.location.href = `mailto:${selectedMessage?.email}`)
                }
              >
                <Reply className="w-4 h-4 mr-2" />
                Balas Email
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AdminMessagesDisplay;