"use client";

import { LineChart, Line, XAxis, CartesianGrid } from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useAdminTheme } from "../admin-theme-provider";
import {
  formatINRCompact,
  formatShortDate,
} from "@/lib/admin/format";
import { cn } from "@/lib/utils";

interface LineChartCardProps {
  title: string;
  data: { date: string; value: number }[];
  // A string flag, not a function — functions can't cross the Server →
  // Client boundary as props (only Server Actions marked "use server"
  // can). The Client Component resolves its own formatter locally
  // from this flag instead of receiving one from the caller.
  valueFormat?: "currency" | "number";
}

export function LineChartCard({
  title,
  data,
  valueFormat = "number",
}: LineChartCardProps) {
  const { theme } = useAdminTheme();
  const isDark = theme === "dark";

  const lineColor = isDark ? "#f5f5f5" : "#171717";
  const gridColor = isDark ? "#262626" : "#e5e5e5";
  const tickColor = isDark ? "#737373" : "#a3a3a3";

  const formatValue = (value: number) =>
    valueFormat === "currency"
      ? formatINRCompact(value)
      : String(value);

  const chartConfig = {
    value: { label: title },
  };

  return (
    <Card
      className={cn(
        "gap-0 py-0",
        isDark
          ? "border-neutral-800 bg-neutral-900"
          : "border-neutral-200 bg-white"
      )}
    >
      <CardHeader className="border-b p-0 border-inherit">
        <CardTitle
          className={cn(
            "px-4 py-3 text-sm font-medium",
            isDark ? "text-neutral-100" : "text-neutral-900"
          )}
        >
          {title}
        </CardTitle>
      </CardHeader>

      <CardContent className="p-4">
        <ChartContainer config={chartConfig} className="h-40 w-full">
          <LineChart
            data={data}
            margin={{ left: -20, right: 8, top: 8, bottom: 0 }}
          >
            <CartesianGrid
              stroke={gridColor}
              strokeDasharray="3 3"
              vertical={false}
            />

            <XAxis
              dataKey="date"
              tickFormatter={formatShortDate}
              tickLine={false}
              axisLine={false}
              tick={{ fill: tickColor, fontSize: 11 }}
              interval={Math.ceil(data.length / 8)}
            />

            <ChartTooltip
              content={
                <ChartTooltipContent
                  labelFormatter={(label) =>
                    formatShortDate(String(label))
                  }
                  formatter={(value) => formatValue(Number(value))}
                />
              }
            />

            <Line
              dataKey="value"
              type="monotone"
              stroke={lineColor}
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}