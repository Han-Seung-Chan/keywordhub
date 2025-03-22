import { memo, useMemo } from "react";
import { lazy } from "react";

import { TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ColumnInfo, HeaderInfo, KeywordData } from "@/types/table";

// 차트 컴포넌트를 lazy 로딩으로 변경
const MonthlyRatioChart = lazy(() => import("@/components/bar-chart"));

// 타입 정의
interface ChartCellProps {
  item: KeywordData;
  columnId: string;
  dataKey: string;
  isDragging: boolean;
}

// 차트 셀 컴포넌트 - 독립적 메모이제이션
const ChartCell = memo(
  ({ item, columnId, dataKey, isDragging }: ChartCellProps) => {
    // 연관 키워드 컴포넌트는 차트 데이터가 없기 때문에 차트 사용이 필요할 때만 불러옴
    // useMemo를 사용하지 않고 상수로 변경
    const isChartDataKey =
      dataKey === "yearPcGraph" || dataKey === "yearMoGraph";
    const hasChartData = Boolean(item.pcYearData);

    // 차트 컴포넌트가 없거나 연관 키워드 데이터에는 차트 데이터가 없는 경우 처리
    if (!isChartDataKey || !hasChartData) {
      return (
        <TableCell
          key={`${item.id}-${columnId}`}
          className="bg-background border border-gray-200 p-0 text-center duration-200"
          style={{
            backgroundColor: isDragging
              ? "rgba(209, 213, 219, 0.8)"
              : undefined,
          }}
        >
          -
        </TableCell>
      );
    }

    // 차트 데이터 메모이제이션
    const chartData = useMemo(() => {
      return dataKey === "yearPcGraph" ? item.pcYearData : item.mobileYearData;
    }, [item, dataKey]);

    return (
      <TableCell
        key={`${item.id}-${columnId}`}
        className="bg-background border border-gray-200 p-0 text-center duration-200"
        style={{
          backgroundColor: isDragging ? "rgba(209, 213, 219, 0.8)" : undefined,
        }}
      >
        <MonthlyRatioChart renderData={chartData} />
      </TableCell>
    );
  },
);

ChartCell.displayName = "ChartCell";

// 일반 데이터 셀 컴포넌트 - 독립적 메모이제이션
const DataCell = memo(
  ({
    item,
    column,
    isDragging,
  }: {
    item: KeywordData;
    column: ColumnInfo;
    isDragging: boolean;
  }) => {
    const cellValue = useMemo(() => {
      return renderCellValue(item, column.dataKey);
    }, [item, column.dataKey]);

    return (
      <TableCell
        key={`${item.id}-${column.id}`}
        className="bg-background border border-gray-200 text-center transition-colors duration-200"
        style={{
          backgroundColor: isDragging ? "rgba(209, 213, 219, 0.8)" : undefined,
        }}
      >
        {cellValue}
      </TableCell>
    );
  },
);

DataCell.displayName = "DataCell";

// 셀 값 렌더링을 위한 범용 함수
const renderCellValue = (item: KeywordData, dataKey?: string): string => {
  // 데이터 키가 있고 아이템에 값이 있는 경우
  if (dataKey && item[dataKey as keyof KeywordData] !== undefined) {
    // 숫자 포맷팅
    if (typeof item[dataKey as keyof KeywordData] === "number") {
      return (item[dataKey as keyof KeywordData] as number).toLocaleString();
    }
    return String(item[dataKey as keyof KeywordData]);
  }

  // 관계형 데이터 처리 (예: 중첩된 객체)
  if (dataKey && dataKey.includes(".")) {
    const parts = dataKey.split(".");
    let value: unknown = item;
    for (const part of parts) {
      if (value === undefined || value === null) return "-";
      value = (value as Record<string, unknown>)[part];
    }

    if (typeof value === "number") {
      return value.toLocaleString();
    }

    return value !== undefined && value !== null ? String(value) : "-";
  }

  return "-";
};

interface TableCellMemoProps {
  item: KeywordData;
  column: ColumnInfo;
  isDragging: boolean;
}

const TableCellMemo = memo(
  ({ item, column, isDragging }: TableCellMemoProps) => {
    // 차트 렌더링 케이스
    if (column.dataKey === "yearPcGraph" || column.dataKey === "yearMoGraph") {
      return (
        <ChartCell
          item={item}
          columnId={column.id}
          dataKey={column.dataKey}
          isDragging={isDragging}
        />
      );
    }

    // 일반 셀 렌더링
    return <DataCell item={item} column={column} isDragging={isDragging} />;
  },
);

TableCellMemo.displayName = "TableCellMemo";

interface TableRowMemoProps {
  item: KeywordData;
  columns: ColumnInfo[];
  draggingHeaderId?: string | null;
}

const TableRowMemo = memo(
  ({ item, columns, draggingHeaderId }: TableRowMemoProps) => {
    const draggingStates = useMemo(() => {
      return columns.map((column) => ({
        column,
        isDragging: draggingHeaderId === column.id,
      }));
    }, [columns, draggingHeaderId]);

    return (
      <TableRow key={item.id}>
        {draggingStates.map(({ column, isDragging }) => (
          <TableCellMemo
            key={`${item.id}-${column.id}`}
            item={item}
            column={column}
            isDragging={isDragging}
          />
        ))}
      </TableRow>
    );
  },
);

TableRowMemo.displayName = "TableRowMemo";

interface DataRowsProps {
  keywordData: KeywordData[];
  columns: HeaderInfo[];
  draggingHeaderId?: string | null;
  emptyMessage?: string;
}

export const DataRows = memo(
  ({
    keywordData,
    columns,
    draggingHeaderId,
    emptyMessage = "키워드를 조회하세요.",
  }: DataRowsProps) => {
    const emptyContent = useMemo(() => {
      if (keywordData.length === 0) {
        return (
          <TableBody>
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className="text-muted-foreground h-24 border border-gray-200 text-center"
              >
                {emptyMessage}
              </TableCell>
            </TableRow>
          </TableBody>
        );
      }
      return null;
    }, [keywordData.length, columns.length, emptyMessage]);

    if (keywordData.length === 0) {
      return emptyContent;
    }

    return (
      <TableBody>
        {keywordData.map((item) => (
          <TableRowMemo
            key={item.id}
            item={item}
            columns={columns}
            draggingHeaderId={draggingHeaderId}
          />
        ))}
      </TableBody>
    );
  },
);

DataRows.displayName = "DataRows";
