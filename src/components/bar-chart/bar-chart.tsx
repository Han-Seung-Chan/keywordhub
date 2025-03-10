"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
} from "recharts";
import { format, parse } from "date-fns";

import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { Card, CardContent } from "@/components/ui/card";

export default function MonthlyRatioChart({ renderData }) {
  // 데이터 포맷팅
  const formattedData = renderData.results[0].data.map((item) => ({
    ...item,
    mainDisplayMonth: format(
      parse(item.period, "yyyy-MM-dd", new Date()),
      "yy-MM",
    ),
  }));

  return (
    <Card className="w-full rounded-none border-none bg-inherit py-1">
      <CardContent className="p-0">
        <ChartContainer
          config={{
            ratio: {
              label: "검색 비율 (%)",
              color: "hsl(var(--chart-1))",
            },
          }}
          className="h-22 w-full"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={formattedData}
              margin={{ top: 0, right: 5, left: 5, bottom: 5 }}
              accessibilityLayer
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="mainDisplayMonth"
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 8 }}
                dy={0}
                dx={3}
                tickMargin={0}
                interval={0}
                angle={-55}
                textAnchor="end"
                height={25}
              />
              {/* <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={0}
                tickFormatter={(value) => `${value}%`}
                domain={[0, 100]}
                tick={{ fontSize: 8 }}
                width={25}
                allowDecimals={false}
                dx={0}
                ticks={[0, 25, 50, 75, 100]}
              /> */}
              <ChartTooltip
                cursor={{ fill: "hsl(var(--muted))", opacity: 0.15 }}
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    const item = payload[0].payload;
                    return (
                      <div className="bg-background rounded-md border p-1.5 text-xs shadow-sm">
                        <div className="grid grid-cols-2 gap-1.5">
                          <div className="flex flex-col">
                            <span className="text-muted-foreground text-[0.65rem]">
                              Month
                            </span>
                            <span className="text-foreground font-bold">
                              {item.mainDisplayMonth}
                            </span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-muted-foreground text-[0.65rem]">
                              Ratio
                            </span>
                            <span className="text-foreground font-bold">
                              {item.ratio.toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar
                dataKey="ratio"
                fill="var(--color-ratio, #3b82f6)"
                radius={[3, 3, 0, 0]}
                maxBarSize={20}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
