import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Loader } from "lucide-react";

export function DeleteUserDialog({
  open,
  onOpenChange,
  onConfirm,
  userName,
  pending,
}) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="bg-[#0F0F11] border-white/10 text-white">
        <AlertDialogHeader>
          <AlertDialogTitle>Apakah Anda yakin?</AlertDialogTitle>
          <AlertDialogDescription className="text-zinc-400">
            Tindakan ini tidak dapat dibatalkan. User{" "}
            <span className="font-bold text-white">{userName}</span> akan
            dihapus permanen dari database.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="bg-transparent border-white/10 text-zinc-300 hover:bg-white/5 hover:text-white">
            Batal
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            {pending ? (
              <Loader className="w-4 h-4 animate-spin" />
            ) : (
              "Hapus User"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}