// src/components/users/UserModal.tsx
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { User } from "@/types/user.types";
import RegisterForm from "../forms/RegisterForm";

interface UserModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: User | null; // Si viene con datos, es modo edición
  onSuccess?: () => void; // Callback para refrescar la lista
}

export const UserModal = ({
  open,
  onOpenChange,
  user,
  onSuccess,
}: UserModalProps) => {
  const isEditing = !!user;

  const handleSuccess = () => {
    onSuccess?.();
    onOpenChange(false); // Cierra el modal después de guardar
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Editar Usuario" : "Crear Usuario"}
          </DialogTitle>
        </DialogHeader>
        <RegisterForm user={user} onSuccess={handleSuccess} showRole />
      </DialogContent>
    </Dialog>
  );
};
