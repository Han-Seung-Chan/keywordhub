import { memo, useMemo } from "react";
import { lazy } from "react";

import { TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ColumnInfo, HeaderInfo, KeywordData } from "@/types/table";
import { renderCellValue } from "@/utils/table-utils";

// 차트 컴포넌트를 lazy 로딩으로 변경
const MonthlyRatioChart = lazy(() => import("@/components/bar-chart"));

// 차트 셀 컴포넌트 - 독립적 메모이제이션
interface ChartCellProps {
  item: KeywordData;
  columnId: string;
  dataKey: string;
  isDragging: boolean;
}

const ChartCell = memo(
  ({ item, columnId, dataKey, isDragging }: ChartCellProps) => {
    // 차트 관련 상태 계산
    const isChartDataKey =
      dataKey === "yearPcGraph" || dataKey === "yearMoGraph";
    const hasChartData = Boolean(item.pcYearData);

    const chartData = useMemo(() => {
      if (isChartDataKey && hasChartData) {
        return dataKey === "yearPcGraph"
          ? item.pcYearData
          : item.mobileYearData;
      }
      return null;
    }, [isChartDataKey, hasChartData, dataKey, item]);

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

    return (
      <TableCell
        key={`${item.id}-${columnId}`}
        className="bg-background border border-gray-200 p-0 text-center duration-200"
        style={{
          backgroundColor: isDragging ? "rgba(209, 213, 219, 0.8)" : undefined,
        }}
      >
        {chartData ? <MonthlyRatioChart renderData={chartData} /> : "-"}
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
