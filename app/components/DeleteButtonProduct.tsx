import { deleteProduct } from "@/lib/actionsProducts";
import { Trash2 } from "lucide-react";
import ButtonToast from "./ButtonToast";

interface DeleteButtonProps {
  id: string;
}

export default function DeleteButtonProduct({ id }: DeleteButtonProps) {
  const toastText = "Le produit a été supprimé";

  return (
    <form action={deleteProduct}>
      <input type="hidden" name="id" value={id} />
      <ButtonToast
        toastText={toastText}
        type="submit"
        className="text-white bg-red-500 hover:bg-red-600"
      >
        {" "}
        <Trash2 className="w-4 h-4" />
      </ButtonToast>
    </form>
  );
}
