"use client";

import { format, parse } from "date-fns";
import { memo, useMemo } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
} from "recharts";

import { Card, CardContent } from "@/components/ui/card";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { DataLabResponse } from "@/types/data-lab";

// Props 타입 정의 추가
interface MonthlyRatioChartProps {
  renderData: DataLabResponse;
}

const MonthlyRatioChart = memo(({ renderData }: MonthlyRatioChartProps) => {
  // 안전하게 데이터 소스 추출 - 종속성 문제 해결
  const dataSource = useMemo(() => {
    if (!renderData?.results?.[0]?.data) return [];
    return renderData.results[0].data;
  }, [renderData]);

  // 데이터 존재 여부 확인 - 추출된 데이터 소스 사용
  const hasData = dataSource.length > 0;

  // 포맷된 데이터 생성 - 추출된 데이터 소스에 의존
  const formattedData = useMemo(() => {
    if (!hasData) return [];

    return dataSource.map((item) => ({
      ...item,
      mainDisplayMonth: format(
        parse(item.period, "yyyy-MM-dd", new Date()),
        "yy-MM",
      ),
    }));
  }, [hasData, dataSource]); // 이제 dataSource에 의존

  // 차트 설정 메모이제이션 - 항상 실행
  const chartConfig = useMemo(
    () => ({
      margin: { top: 0, right: 5, left: 5, bottom: 5 },
      cursorStyle: { fill: "hsl(var(--muted))", opacity: 0.15 },
    }),
    [],
  );

  // 데이터가 없는 경우 빈 차트 렌더링
  if (!hasData) {
    return (
      <Card className="w-full rounded-none border-none bg-inherit py-1">
        <CardContent className="p-0">
          <div className="flex h-14 w-full items-center justify-center text-xs">
            데이터 없음
          </div>
        </CardContent>
      </Card>
    );
  }

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
          className="h-14 w-full"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={formattedData}
              margin={chartConfig.margin}
              accessibilityLayer
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="mainDisplayMonth"
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 6 }}
                dy={0}
                dx={3}
                tickMargin={0}
                interval={0}
                angle={-55}
                textAnchor="end"
                height={18}
              />
              <ChartTooltip
                cursor={chartConfig.cursorStyle}
                content={({ active, payload }) => {
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
                isAnimationActive={false}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
});

// displayName 설정
MonthlyRatioChart.displayName = "MonthlyRatioChart";

export default MonthlyRatioChart;
