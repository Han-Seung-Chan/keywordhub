import MonthlyRatioChart from "@/components/bar-chart";
import { TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ColumnInfo, KeywordData } from "@/types/table";
import { renderCellValue } from "@/utils/table-utils";

interface DataRowsProps {
  keywordData: KeywordData[];
  columns: ColumnInfo[];
  draggingHeaderId?: string | null;
}

export function DataRows({
  keywordData,
  columns,
  draggingHeaderId,
}: DataRowsProps) {
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
        <TableRow key={item.id}>
          {columns.map((column) => {
            // 드래그 중인 헤더에 속한 데이터 셀인지 확인
            const isDragging = draggingHeaderId === column.id;

            if (
              column.dataKey === "yearPcGraph" ||
              column.dataKey === "yearMoGraph"
            ) {
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

            return (
              <TableCell
                key={`${item.id}-${column.id}`}
                className="bg-background border border-gray-200 text-center transition-colors duration-200"
                style={{
                  backgroundColor: isDragging
                    ? "rgba(209, 213, 219, 0.8)"
                    : undefined,
                }}
              >
                {}
                {renderCellValue(item, column.dataKey)}
              </TableCell>
            );
          })}
        </TableRow>
      ))}
    </TableBody>
  );
}
