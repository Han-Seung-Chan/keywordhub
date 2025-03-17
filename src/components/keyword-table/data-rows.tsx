import { memo } from "react";
import MonthlyRatioChart from "@/components/bar-chart";
import { TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ColumnInfo, HeaderInfo, KeywordData } from "@/types/table";
import { renderCellValue } from "@/utils/table-utils";

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
        <TableCell
          key={`${item.id}-${column.id}`}
          className="bg-background border border-gray-200 p-0 text-center duration-200"
          style={{
            backgroundColor: isDragging
              ? "rgba(209, 213, 219, 0.8)"
              : undefined,
          }}
        >
          <MonthlyRatioChart
            renderData={
              column.dataKey === "yearPcGraph"
                ? item.pcYearData
                : item.mobileYearData
            }
          />
        </TableCell>
      );
    }

    // 일반 셀 렌더링
    return (
      <TableCell
        key={`${item.id}-${column.id}`}
        className="bg-background border border-gray-200 text-center transition-colors duration-200"
        style={{
          backgroundColor: isDragging ? "rgba(209, 213, 219, 0.8)" : undefined,
        }}
      >
        {renderCellValue(item, column.dataKey)}
      </TableCell>
    );
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
    return (
      <TableRow key={item.id}>
        {columns.map((column) => {
          const isDragging = draggingHeaderId === column.id;

          return (
            <TableCellMemo
              key={`${item.id}-${column.id}`}
              item={item}
              column={column}
              isDragging={isDragging}
            />
          );
        })}
      </TableRow>
    );
  },
);

TableRowMemo.displayName = "TableRowMemo";

interface DataRowsProps {
  keywordData: KeywordData[];
  columns: HeaderInfo[];
  draggingHeaderId?: string | null;
}
export const DataRows = memo(
  ({ keywordData, columns, draggingHeaderId }: DataRowsProps) => {
    if (keywordData.length === 0) {
      return (
        <TableBody>
          <TableRow>
            <TableCell
              colSpan={columns.length}
              className="text-muted-foreground h-24 border border-gray-200 text-center"
            >
              키워드를 조회하세요.
            </TableCell>
          </TableRow>
        </TableBody>
      );
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
