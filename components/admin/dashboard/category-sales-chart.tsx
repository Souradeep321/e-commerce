// components/admin/dashboard/category-sales-chart.tsx
"use client";

import { BarChart, Bar, XAxis, CartesianGrid } from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { useAdminTheme } from "../admin-theme-provider";
import { formatINRCompact } from "@/lib/admin/format";
import { cn } from "@/lib/utils";
import { CategorySalesPoint } from "@/types/api/analytics.types";

interface CategorySalesChartProps {
  data: CategorySalesPoint[];
}

export function CategorySalesChart({ data }: CategorySalesChartProps) {
  const { theme } = useAdminTheme();
  const isDark = theme === "dark";

  const barColor = isDark ? "#e5e5e5" : "#262626";
  const gridColor = isDark ? "#262626" : "#e5e5e5";
  const tickColor = isDark ? "#737373" : "#a3a3a3";

  const chartConfig = { sales: { label: "Sales" } };

  return (
    <Card
      className={cn(
        "gap-0 py-0",
        isDark ? "border-neutral-800 bg-neutral-900" : "border-neutral-200 bg-white"
      )}
    >
      <CardHeader className="border-b p-0 [border-color:inherit]">
        <CardTitle
          className={cn(
            "px-4 py-3 text-sm font-medium",
            isDark ? "text-neutral-100" : "text-neutral-900"
          )}
        >
          Sales by Category
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <ChartContainer config={chartConfig} className="h-52 w-full">
          <BarChart data={data} margin={{ left: -20, right: 8, top: 8, bottom: 0 }}>
            <CartesianGrid stroke={gridColor} strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="category"
              tickLine={false}
              axisLine={false}
              tick={{ fill: tickColor, fontSize: 11 }}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(value) => formatINRCompact(Number(value))}
                />
              }
            />
            <Bar dataKey="sales" fill={barColor} radius={[3, 3, 0, 0]} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}