"use client";

import { useState } from "react";
import {
  Edit,
  Trash2,
  Search,
  Filter,
  MoreHorizontal,
  Shield,
  Store,
  Phone,
  Mail,
  UserPlus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
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
import { UpsertUserDialog } from "@/components/shared/dialog/upsert-dialog-user";
import { DeleteUserDialog } from "@/components/shared/dialog/delete-dialog-user";
import { useUsers } from "@/hooks/use-users";
import {
  useCreateUser,
  useUpdateUser,
  useDeleteUser,
} from "@/hooks/use-users";

const AdminUsersDisplay = ({ initialUsers }) => {
  const { data: usersData, isLoading } = useUsers(
    { page: 1, limit: 50 },
    { initialData: { data: initialUsers } }
  );
  const users = usersData?.data || initialUsers;

  const createUser = useCreateUser();
  const updateUser = useUpdateUser();
  const deleteUser = useDeleteUser();

  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [selectedUser, setSelectedUser] = useState(null);
  const [isUpsertOpen, setIsUpsertOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRole = roleFilter === "ALL" || user.role === roleFilter;
    const matchesStatus =
      statusFilter === "ALL" || user.status === statusFilter;

    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleOpenCreate = () => {
    setSelectedUser(null);
    setIsUpsertOpen(true);
  };

  const handleOpenEdit = (user) => {
    setSelectedUser(user);
    setIsUpsertOpen(true);
  };

  const handleOpenDelete = (user) => {
    setSelectedUser(user);
    setIsDeleteOpen(true);
  };

  const handleUpsertSubmit = (data) => {
    if (selectedUser) {
      updateUser.mutate(
        { userId: selectedUser.id, formData: data },
        {
          onSuccess: () => {
            setIsUpsertOpen(false);
          },
        }
      );
    } else {
      createUser.mutate(data, {
        onSuccess: () => {
          setIsUpsertOpen(false);
        },
      });
    }
  };

  const handleDeleteConfirm = () => {
    if (!selectedUser) return;

    deleteUser.mutate(selectedUser.id, {
      onSuccess: () => {
        setIsDeleteOpen(false);
      },
    });
  };

  return (
    <>
      <div className="flex justify-end mb-6">
        <Button
          onClick={handleOpenCreate}
          className="bg-linear-to-r from-fuchsia-600 to-pink-600 hover:shadow-[0_0_20px_rgba(217,70,239,0.3)] text-white border-none h-12 px-6 rounded-xl"
        >
          <UserPlus className="w-5 h-5 mr-2" /> Buat User Baru
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total User", value: users.length, color: "text-white" },
          {
            label: "Active Sellers",
            value: users.filter((u) => u.role === "SELLER").length,
            color: "text-emerald-400",
          },
          {
            label: "Admins",
            value: users.filter((u) => u.role === "ADMIN").length,
            color: "text-fuchsia-400",
          },
          {
            label: "All Bookings",
            value: users.reduce((sum, u) => sum + (u.totalBookings || 0), 0),
            color: "text-blue-400",
          },
        ].map((stat, i) => (
          <Card key={i} className="bg-[#0F0F11] border-white/5">
            <CardContent className="p-6">
              <div className={`text-3xl font-bold ${stat.color} mb-1`}>
                {stat.value}
              </div>
              <div className="text-xs text-zinc-500 uppercase tracking-wider font-medium">
                {stat.label}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-[#0F0F11] border-white/10 overflow-hidden shadow-xl py-6">
        <CardHeader className="border-b border-white/5 pb-4">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <Input
                placeholder="Cari nama atau email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white/5 border-white/10 text-white focus-visible:ring-fuchsia-500/50"
              />
            </div>

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={`border-white/10 bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10 ${
                    roleFilter !== "ALL" || statusFilter !== "ALL"
                      ? "text-fuchsia-400 border-fuchsia-500/50 bg-fuchsia-500/10"
                      : ""
                  }`}
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Filters{" "}
                  {(roleFilter !== "ALL" || statusFilter !== "ALL") &&
                    "(Aktif)"}
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-80 bg-[#18181b] border-white/10 text-zinc-200 p-4"
                align="end"
              >
                <div className="space-y-4">
                  <h4 className="font-medium leading-none text-white">
                    Filter Users
                  </h4>
                  <div className="space-y-2">
                    <Label className="text-xs text-zinc-500">Role</Label>
                    <Select value={roleFilter} onValueChange={setRoleFilter}>
                      <SelectTrigger className="bg-black/20 border-white/10 h-8 text-xs">
                        <SelectValue placeholder="Select Role" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#18181b] border-white/10 text-zinc-300">
                        <SelectItem value="ALL">Semua Role</SelectItem>
                        <SelectItem value="ADMIN">Admin</SelectItem>
                        <SelectItem value="SELLER">Seller</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs text-zinc-500">Status Akun</Label>
                    <Select
                      value={statusFilter}
                      onValueChange={setStatusFilter}
                    >
                      <SelectTrigger className="bg-black/20 border-white/10 h-8 text-xs">
                        <SelectValue placeholder="Select Status" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#18181b] border-white/10 text-zinc-300">
                        <SelectItem value="ALL">Semua Status</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {(roleFilter !== "ALL" || statusFilter !== "ALL") && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setRoleFilter("ALL");
                        setStatusFilter("ALL");
                      }}
                      className="w-full border border-red-800 text-xs bg-zinc-950 hover:bg-zinc-900 text-red-400 hover:text-red-300 h-8"
                    >
                      Reset Filter
                    </Button>
                  )}
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </CardHeader>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-white/5 border-b border-white/5">
              <TableRow className="border-b border-white/5 hover:bg-transparent">
                <TableHead className="text-zinc-400 font-medium">
                  User Profile
                </TableHead>
                <TableHead className="text-zinc-400 font-medium">
                  Role
                </TableHead>
                <TableHead className="text-zinc-400 font-medium">
                  Contact
                </TableHead>
                <TableHead className="text-zinc-400 font-medium">
                  Stats
                </TableHead>
                <TableHead className="text-zinc-400 font-medium text-right">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-white/5">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <TableRow
                    key={user.id}
                    className="border-b border-white/5 hover:bg-white/5 transition-colors group"
                  >
                    <TableCell className="py-4">
                      <div className="flex items-center gap-4">
                        <Avatar className="h-10 w-10 border border-white/10">
                          <AvatarImage src={user.avatar} />
                          <AvatarFallback className="bg-zinc-800 text-zinc-400">
                            {user.name?.charAt(0) || "U"}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-semibold text-white flex items-center gap-2">
                            {user.name}
                            {user.status === "inactive" && (
                              <Badge
                                variant="outline"
                                className="text-[10px] h-4 px-1 border-red-500/30 text-red-500"
                              >
                                Inactive
                              </Badge>
                            )}
                          </div>
                          <div className="text-sm text-zinc-500 flex items-center gap-1">
                            <Mail className="w-3 h-3" /> {user.email}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`gap-1.5 pl-1.5 pr-2.5 py-1 ${
                          user.role === "ADMIN"
                            ? "bg-fuchsia-500/10 text-fuchsia-400 border-fuchsia-500/20"
                            : "bg-blue-500/10 text-blue-400 border-blue-500/20"
                        }`}
                      >
                        {user.role === "ADMIN" ? (
                          <Shield className="w-3 h-3" />
                        ) : (
                          <Store className="w-3 h-3" />
                        )}
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-sm text-zinc-400">
                        <Phone className="w-3 h-3" /> {user.phone || "N/A"}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-white">
                          {user._count.bookings || 0} Bookings
                        </span>
                        <span className="text-xs text-zinc-500">
                          Joined{" "}
                          {new Date(
                            user.joinDate || user.createdAt
                          ).toLocaleDateString()}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
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
                            onClick={() => handleOpenEdit(user)}
                          >
                            <Edit className="w-4 h-4 mr-2" /> Edit Profile
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="hover:bg-white/10 cursor-pointer text-red-400 focus:text-red-400 focus:bg-red-500/10"
                            onClick={() => handleOpenDelete(user)}
                          >
                            <Trash2 className="w-4 h-4 mr-2" /> Delete User
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="h-24 text-center text-zinc-500"
                  >
                    Tidak ada user yang cocok dengan filter Anda.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      <UpsertUserDialog
        key={selectedUser?.id || "new"}
        open={isUpsertOpen}
        onOpenChange={setIsUpsertOpen}
        onSubmit={handleUpsertSubmit}
        defaultValues={selectedUser}
      />

      <DeleteUserDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        onConfirm={handleDeleteConfirm}
        userName={selectedUser?.name}
        pending={deleteUser.isPending}
      />
    </>
  );
};

export default AdminUsersDisplay;