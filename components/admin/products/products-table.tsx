// components/admin/products/products-table.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { Pencil, Eye, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableHead,
    TableCell,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAdminTheme } from "../admin-theme-provider";
import { formatProductPrice } from "@/lib/format";
import { cn } from "@/lib/utils";
import { AdminProductListItem } from "@/types/api/product.types";

interface ProductsTableProps {
    products: AdminProductListItem[];
}

export function ProductsTable({ products }: ProductsTableProps) {
    const { theme } = useAdminTheme();
    const isDark = theme === "dark";
    const borderColor = isDark ? "border-neutral-800" : "border-neutral-200";

    // Delete isn't wired to a real mutation yet (mock data, no admin
    // DELETE call in place here) — surfaces a toast rather than doing
    // nothing silently, same "not yet wired" pattern as add-to-cart-
    // button.tsx's TODOs elsewhere in the app.
    function handleDelete(product: AdminProductListItem) {
        toast.info(`Delete not yet wired up — would remove "${product.name}"`);
    }

    return (
        <Card className={cn("gap-0 overflow-hidden py-0", borderColor, isDark ? "bg-neutral-900" : "bg-white")}>
            <div className="overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow className={cn("hover:bg-transparent", borderColor)}>
                            {["Product", "Category", "Price", "Status", ""].map((h) => (
                                <TableHead
                                    key={h}
                                    className={cn(
                                        "text-xs uppercase tracking-wide",
                                        isDark ? "text-neutral-500" : "text-neutral-400",
                                        h === "" && "text-right"
                                    )}
                                >
                                    {h === "" ? "Actions" : h}
                                </TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {products.map((product) => (
                            <TableRow
                                key={product.id}
                                className={cn(borderColor, isDark ? "hover:bg-neutral-800/50" : "hover:bg-neutral-50")}
                            >
                                <TableCell>
                                    <div className="flex items-center gap-3">
                                        <div
                                            className={cn(
                                                "relative h-10 w-10 shrink-0 overflow-hidden rounded",
                                                isDark ? "bg-neutral-800" : "bg-neutral-100"
                                            )}
                                        >
                                            {product.images[0]?.url && (
                                                <Image
                                                    src={product.images[0].url}
                                                    alt={product.name}
                                                    fill
                                                    className="object-cover"
                                                    sizes="40px"
                                                />
                                            )}
                                        </div>
                                        <span className={cn("font-medium", isDark ? "text-neutral-100" : "text-neutral-900")}>
                                            {product.name}
                                        </span>
                                    </div>
                                </TableCell>

                                <TableCell className={isDark ? "text-neutral-400" : "text-neutral-500"}>
                                    {product.category?.name ?? "—"}
                                </TableCell>

                                <TableCell className={isDark ? "text-neutral-100" : "text-neutral-900"}>
                                    {formatProductPrice(product)}
                                </TableCell>

                                <TableCell>
                                    <Badge
                                        variant="outline"
                                        className={cn(
                                            "text-[10px] font-medium uppercase tracking-wide",
                                            product.isActive
                                                ? isDark
                                                    ? "border-green-900 bg-green-950/40 text-green-400"
                                                    : "border-green-200 bg-green-50 text-green-700"
                                                : isDark
                                                    ? "border-neutral-700 bg-neutral-800 text-neutral-500"
                                                    : "border-neutral-200 bg-neutral-100 text-neutral-400"
                                        )}
                                    >
                                        {product.isActive ? "Active" : "Inactive"}
                                    </Badge>
                                </TableCell>

                                <TableCell>
                                    <div className="flex items-center justify-end gap-1">
                                        <Button variant="ghost" size="icon-xs" asChild>
                                            <Link href={`/admin/products/${product.id}/edit`} aria-label={`Edit ${product.name}`}>
                                                <Pencil className={isDark ? "text-neutral-400" : "text-neutral-500"} />
                                            </Link>
                                        </Button>
                                        <Button variant="ghost" size="icon-xs" asChild>
                                            <Link
                                                href={`/products/${product.slug}`}
                                                target="_blank"
                                                aria-label={`View ${product.name} on storefront`}
                                            >
                                                <Eye className={isDark ? "text-neutral-400" : "text-neutral-500"} />
                                            </Link>
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon-xs"
                                            aria-label={`Delete ${product.name}`}
                                            onClick={() => handleDelete(product)}
                                        >
                                            <Trash2 className={isDark ? "text-neutral-400" : "text-neutral-500"} />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </Card>
    );
}