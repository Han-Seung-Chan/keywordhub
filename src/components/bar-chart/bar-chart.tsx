"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import { format, parse } from "date-fns";

import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { Card, CardContent } from "@/components/ui/card";
import { DataLabResponse } from "@/types/data-lab";

// PC와 모바일 데이터를 합치는 함수
const combineData = (pcData: DataLabResponse, mobileData: DataLabResponse) => {
  if (!pcData?.results?.[0]?.data || !mobileData?.results?.[0]?.data) {
    return [];
  }

  const pcDataPoints = pcData.results[0].data;
  const mobileDataPoints = mobileData.results[0].data;

  // 모든 고유 기간을 수집
  const allPeriods = [
    ...new Set([
      ...pcDataPoints.map((item) => item.period),
      ...mobileDataPoints.map((item) => item.period),
    ]),
  ].sort();

  // 기간별로 PC 및 모바일 데이터를 합친 값 계산
  return allPeriods.map((period) => {
    const pcItem = pcDataPoints.find((item) => item.period === period) || {
      ratio: 0,
    };
    const mobileItem = mobileDataPoints.find(
      (item) => item.period === period,
    ) || { ratio: 0 };

    // PC와 모바일 비율의 합계 (여기서는 단순 평균 사용)
    const combinedRatio = (pcItem.ratio + mobileItem.ratio) / 2;

    return {
      period,
      ratio: Number.parseFloat(combinedRatio.toFixed(2)),
      pcRatio: pcItem.ratio,
      mobileRatio: mobileItem.ratio,
    };
  });
};

export default function MonthlyRatioChart({ pcData, mobileData }) {
  // PC와 모바일 데이터 합치기
  const combinedData = combineData(pcData, mobileData);

  // 데이터 포맷팅
  const formattedData = combinedData.map((item) => ({
    ...item,
    month: format(parse(item.period, "yyyy-MM-dd", new Date()), "MM"),
    year: format(parse(item.period, "yyyy-MM-dd", new Date()), "yyyy"),
    mainDisplayMonth: format(
      parse(item.period, "yyyy-MM-dd", new Date()),
      "yy-MM",
    ),
    formattedRatio: item.ratio,
    percentageDisplay: `${item.ratio.toFixed(2)}%`,
  }));

  return (
    <Card className="w-full rounded-none py-1">
      <CardContent className="p-0">
        <ChartContainer
          config={{
            ratio: {
              label: "검색 비율 (%)",
              color: "hsl(var(--chart-1))",
            },
          }}
          className="h-21 w-full"
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
                tickMargin={0}
                interval={0}
                angle={-45}
                textAnchor="end"
                height={22}
              />
              <YAxis
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
              />
              <ChartTooltip
                cursor={{ fill: "hsl(var(--muted))", opacity: 0.15 }}
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    const item = payload[0].payload;
                    return (
                      <div className="bg-background rounded-md border p-1.5 text-xs shadow-sm">
                        {/* 툴팁 크기 및 패딩 축소 */}
                        <div className="grid grid-cols-2 gap-1.5">
                          {/* 그리드 갭 축소 */}
                          <div className="flex flex-col">
                            <span className="text-muted-foreground text-[0.65rem] uppercase">
                              Month
                            </span>
                            <span className="text-foreground font-bold">
                              {item.month}/{item.year}
                            </span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-muted-foreground text-[0.65rem] uppercase">
                              Combined Ratio
                            </span>
                            <span className="text-foreground font-bold">
                              {item.ratio.toFixed(2)}%
                            </span>
                          </div>
                          {/* <div className="col-span-2 flex flex-col">
                            <div className="mt-0.5 flex justify-between text-[0.65rem]">
                              <span>PC: {item.pcRatio.toFixed(2)}%</span>
                              <span>
                                Mobile: {item.mobileRatio.toFixed(2)}%
                              </span>
                            </div>
                          </div> */}
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
                radius={[3, 3, 0, 0]} // 막대 모서리 반경 축소
                maxBarSize={16} // 막대 최대 너비 축소
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
