"use server"

import prisma from "@/lib/db"
import { revalidatePath } from "../../node_modules/next/cache";

interface dd {
	id: number;
	itemName: string;
	category: string;
	quantity: number;
	price: number;
	supplier: string;
	dateUpdated: Date;
}
export async function new_item(data:FormData)
{
	await prisma.Inventory.create({
		data:{
			itemName: data.get("itemName") as string,
			category: data.get("category") as string,
			quantity: parseInt(data.get("quantity") as string),
			price: parseFloat(data.get("price") as string),
			supplier: data.get("supplier") as string,
		}
	})
	revalidatePath("/");
}

export async function update_item(data:FormData)
{
	const updatedUser = await prisma.Inventory.update({
		where: {
			id : data.get("id"),
		},
		data: {
			itemName: data.get("itemName") as string,
			category: data.get("category") as string,
			quantity: parseInt(data.get("quantity") as string),
			price: parseFloat(data.get("price") as string),
			supplier: data.get("supplier") as string,
		},
	})
	revalidatePath("/");
}

export async function delete_item(id:Number)
{
	await prisma.Inventory.delete({
		where:{
			id
		}
	})
	revalidatePath("/");
}
