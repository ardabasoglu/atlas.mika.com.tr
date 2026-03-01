"use client";

import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import { useIsMobile } from "@/hooks/use-mobile";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group";

const chartData = [
  { date: "2024-04-01", gelir: 42, firsat: 12 },
  { date: "2024-04-02", gelir: 28, firsat: 18 },
  { date: "2024-04-03", gelir: 55, firsat: 14 },
  { date: "2024-04-04", gelir: 61, firsat: 22 },
  { date: "2024-04-05", gelir: 88, firsat: 19 },
  { date: "2024-04-06", gelir: 72, firsat: 25 },
  { date: "2024-04-07", gelir: 65, firsat: 16 },
  { date: "2024-04-08", gelir: 95, firsat: 28 },
  { date: "2024-04-09", gelir: 31, firsat: 11 },
  { date: "2024-04-10", gelir: 58, firsat: 20 },
  { date: "2024-04-11", gelir: 78, firsat: 24 },
  { date: "2024-04-12", gelir: 69, firsat: 18 },
  { date: "2024-04-13", gelir: 82, firsat: 30 },
  { date: "2024-04-14", gelir: 44, firsat: 15 },
  { date: "2024-04-15", gelir: 38, firsat: 17 },
  { date: "2024-04-16", gelir: 46, firsat: 19 },
  { date: "2024-04-17", gelir: 102, firsat: 32 },
  { date: "2024-04-18", gelir: 91, firsat: 26 },
  { date: "2024-04-19", gelir: 62, firsat: 14 },
  { date: "2024-04-20", gelir: 35, firsat: 12 },
  { date: "2024-04-21", gelir: 48, firsat: 21 },
  { date: "2024-04-22", gelir: 56, firsat: 16 },
  { date: "2024-04-23", gelir: 41, firsat: 23 },
  { date: "2024-04-24", gelir: 86, firsat: 27 },
  { date: "2024-04-25", gelir: 64, firsat: 20 },
  { date: "2024-04-26", gelir: 29, firsat: 13 },
  { date: "2024-04-27", gelir: 94, firsat: 29 },
  { date: "2024-04-28", gelir: 39, firsat: 15 },
  { date: "2024-04-29", gelir: 76, firsat: 22 },
  { date: "2024-04-30", gelir: 108, firsat: 31 },
  { date: "2024-05-01", gelir: 52, firsat: 18 },
  { date: "2024-05-02", gelir: 71, firsat: 24 },
  { date: "2024-05-03", gelir: 59, firsat: 17 },
  { date: "2024-05-04", gelir: 92, firsat: 28 },
  { date: "2024-05-05", gelir: 115, firsat: 33 },
  { date: "2024-05-06", gelir: 118, firsat: 35 },
  { date: "2024-05-07", gelir: 89, firsat: 21 },
  { date: "2024-05-08", gelir: 45, firsat: 19 },
  { date: "2024-05-09", gelir: 54, firsat: 16 },
  { date: "2024-05-10", gelir: 70, firsat: 25 },
  { date: "2024-05-11", gelir: 79, firsat: 23 },
  { date: "2024-05-12", gelir: 50, firsat: 14 },
  { date: "2024-05-13", gelir: 49, firsat: 12 },
  { date: "2024-05-14", gelir: 106, firsat: 34 },
  { date: "2024-05-15", gelir: 112, firsat: 30 },
  { date: "2024-05-16", gelir: 81, firsat: 26 },
  { date: "2024-05-17", gelir: 119, firsat: 36 },
  { date: "2024-05-18", gelir: 75, firsat: 22 },
  { date: "2024-05-19", gelir: 57, firsat: 15 },
  { date: "2024-05-20", gelir: 47, firsat: 20 },
  { date: "2024-05-21", gelir: 33, firsat: 11 },
  { date: "2024-05-22", gelir: 32, firsat: 10 },
  { date: "2024-05-23", gelir: 63, firsat: 24 },
  { date: "2024-05-24", gelir: 73, firsat: 18 },
  { date: "2024-05-25", gelir: 51, firsat: 21 },
  { date: "2024-05-26", gelir: 53, firsat: 13 },
  { date: "2024-05-27", gelir: 99, firsat: 32 },
  { date: "2024-05-28", gelir: 55, firsat: 17 },
  { date: "2024-05-29", gelir: 30, firsat: 9 },
  { date: "2024-05-30", gelir: 84, firsat: 27 },
  { date: "2024-05-31", gelir: 43, firsat: 19 },
  { date: "2024-06-01", gelir: 44, firsat: 16 },
  { date: "2024-06-02", gelir: 111, firsat: 31 },
  { date: "2024-06-03", gelir: 36, firsat: 14 },
  { date: "2024-06-04", gelir: 104, firsat: 29 },
  { date: "2024-06-05", gelir: 34, firsat: 11 },
  { date: "2024-06-06", gelir: 72, firsat: 23 },
  { date: "2024-06-07", gelir: 77, firsat: 26 },
  { date: "2024-06-08", gelir: 90, firsat: 28 },
  { date: "2024-06-09", gelir: 103, firsat: 33 },
  { date: "2024-06-10", gelir: 46, firsat: 18 },
  { date: "2024-06-11", gelir: 35, firsat: 12 },
  { date: "2024-06-12", gelir: 116, firsat: 34 },
  { date: "2024-06-13", gelir: 31, firsat: 10 },
  { date: "2024-06-14", gelir: 101, firsat: 30 },
  { date: "2024-06-15", gelir: 74, firsat: 25 },
  { date: "2024-06-16", gelir: 87, firsat: 27 },
  { date: "2024-06-17", gelir: 113, firsat: 35 },
  { date: "2024-06-18", gelir: 40, firsat: 15 },
  { date: "2024-06-19", gelir: 80, firsat: 24 },
  { date: "2024-06-20", gelir: 96, firsat: 31 },
  { date: "2024-06-21", gelir: 50, firsat: 19 },
  { date: "2024-06-22", gelir: 75, firsat: 22 },
  { date: "2024-06-23", gelir: 114, firsat: 36 },
  { date: "2024-06-24", gelir: 42, firsat: 16 },
  { date: "2024-06-25", gelir: 43, firsat: 17 },
  { date: "2024-06-26", gelir: 102, firsat: 29 },
  { date: "2024-06-27", gelir: 105, firsat: 32 },
  { date: "2024-06-28", gelir: 45, firsat: 20 },
  { date: "2024-06-29", gelir: 37, firsat: 13 },
  { date: "2024-06-30", gelir: 106, firsat: 30 },
];

const chartConfig = {
  gelir: {
    label: "Gelir (bin ₺)",
    color: "var(--primary)",
  },
  firsat: {
    label: "Fırsat sayısı",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

export function OverviewChart() {
  const isMobile = useIsMobile();
  const [timeRange, setTimeRange] = React.useState("90d");

  React.useEffect(() => {
    if (isMobile) {
      setTimeRange("7d");
    }
  }, [isMobile]);

  const filteredData = chartData.filter((item) => {
    const date = new Date(item.date);
    const referenceDate = new Date("2024-06-30");
    let daysToSubtract = 90;
    if (timeRange === "30d") {
      daysToSubtract = 30;
    } else if (timeRange === "7d") {
      daysToSubtract = 7;
    }
    const startDate = new Date(referenceDate);
    startDate.setDate(startDate.getDate() - daysToSubtract);
    return date >= startDate;
  });

  const formatDate = (value: string) => {
    return new Date(value).toLocaleDateString("tr-TR", {
      month: "short",
      day: "numeric",
    });
  };

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Gelir ve Fırsatlar</CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">
            Son 3 aya ait gelir ve fırsat sayısı
          </span>
          <span className="@[540px]/card:hidden">Son 3 ay</span>
        </CardDescription>
        <CardAction>
          <ToggleGroup
            type="single"
            value={timeRange}
            onValueChange={setTimeRange}
            variant="outline"
            className="hidden *:data-[slot=toggle-group-item]:!px-4 @[767px]/card:flex"
          >
            <ToggleGroupItem value="90d">Son 3 ay</ToggleGroupItem>
            <ToggleGroupItem value="30d">Son 30 gün</ToggleGroupItem>
            <ToggleGroupItem value="7d">Son 7 gün</ToggleGroupItem>
          </ToggleGroup>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger
              className="flex w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/card:hidden"
              size="sm"
              aria-label="Zaman aralığı seçin"
            >
              <SelectValue placeholder="Son 3 ay" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="90d" className="rounded-lg">
                Son 3 ay
              </SelectItem>
              <SelectItem value="30d" className="rounded-lg">
                Son 30 gün
              </SelectItem>
              <SelectItem value="7d" className="rounded-lg">
                Son 7 gün
              </SelectItem>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillGelir" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-gelir)"
                  stopOpacity={1.0}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-gelir)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillFirsat" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-firsat)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-firsat)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={formatDate}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={formatDate}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="firsat"
              type="natural"
              fill="url(#fillFirsat)"
              stroke="var(--color-firsat)"
              stackId="a"
            />
            <Area
              dataKey="gelir"
              type="natural"
              fill="url(#fillGelir)"
              stroke="var(--color-gelir)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
