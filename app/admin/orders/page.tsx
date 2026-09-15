
import Link from "next/link";
import { getAdminOrders } from "@/lib/api";

interface AdminOrdersPageProps {
    searchParams: Promise<{
        page?: string;
        status?: string;
    }>;
}

export default async function AdminOrdersPage({ searchParams }: AdminOrdersPageProps) {
    const params = await searchParams;
    const page = Number(params.page) || 1;
    const status = params.status;
    const {orders, totalPages, totalItems} = await getAdminOrders({ 
        page, 
        limit: 8,
        status 
    });
    console.log("AdminOrdersPage orders:", orders); // Debugging log

    return (
        <div>
            <h1>Admin Orders</h1>
            <ul>
                {orders.map((order) => (
                    <li key={order.id}>
                        <Link href={`/admin/orders/${order.id}`}>{order.id}</Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}