"use server"
import Table from "@/components/table/Table";
import prisma from "@/lib/db";
import "@/app/style/style.scss";

export default async function Home() {
  const inventoryData = await prisma.Inventory.findMany({
    // take:10,
    // skip:10
  });
  return (
      <main>
        <Table inventoryData={inventoryData}/>
      </main>
  );
}
