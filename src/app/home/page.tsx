import Table from "../../components/table/Table";
import prisma from "../../lib/db";

export default async function Home()
{
    const data = await prisma.inventory.findMany({
    });
    return (
    
            <Table  inventoryData={data}/>
    
    );
}
