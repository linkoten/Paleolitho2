"use server";
import { prisma } from "./db";
import { revalidatePath } from "next/cache";

export const updateUser = async (formData: FormData) => {
  try {
    const userName = formData.get("name") as string;
    const id = formData.get("id") as string;

    if (userName !== null) {
      await prisma.user.update({
        where: { id },
        data: { name: userName },
      });
    }
  } catch (error) {
    console.error("Error updating user:", error);
  } finally {
    revalidatePath("/");
  }
};
