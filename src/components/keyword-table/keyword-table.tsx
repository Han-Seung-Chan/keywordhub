"use client";

import { useState, useEffect, useRef } from "react";
import { Table } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { RefreshCw, GripVertical } from "lucide-react";
import { useTableDrag } from "@/hooks/useTableDrag";
import { HeaderInfo, KeywordData } from "@/types/table";
import { DragDropContext } from "@/components/keyword-table/drag-components";
import { HeaderRow } from "@/components/keyword-table/header-row";
import { DataRows } from "@/components/keyword-table/data-rows";
import { defaultHeader } from "@/constants/default-header";

interface KeywordTableProps {
  keywordData?: KeywordData[];
}

export default function KeywordTable({ keywordData = [] }: KeywordTableProps) {
  const [isClient, setIsClient] = useState(false);
  const hasResults = keywordData.length > 0;

  const initialHeadersRef = useRef<HeaderInfo[]>(defaultHeader);

  const {
    headers,
    draggingHeaderId,
    onDragStart,
    onDragEnd,
    resetHeaderOrder,
  } = useTableDrag({
    initialHeaders: initialHeadersRef.current,
  });

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

  return (
    <div className="w-full">
      <div className="my-2 flex content-center justify-between">
        {hasResults && (
          <div className="text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <GripVertical className="h-3 w-3" />
              헤더를 드래그하여 테이블 컬럼 순서를 변경할 수 있습니다.
            </span>
          </div>
        )}

        <Button
          variant="outline"
          size="sm"
          onClick={resetHeaderOrder}
          className="text-xs"
          disabled={!hasResults}
        >
          <RefreshCw className="mr-1 h-3 w-3" /> 테이블 순서 초기화
        </Button>
      </div>

      <div className="table-container overflow-auto rounded-md">
        <DragDropContext onDragStart={onDragStart} onDragEnd={onDragEnd}>
          <Table className="border-collapse">
            <HeaderRow headers={headers} />
            <DataRows
              keywordData={keywordData}
              columns={headers}
              draggingHeaderId={draggingHeaderId}
            />
          </Table>
        </DragDropContext>
      </div>

      {/* 모바일 안내 추가 */}
      <div className="mt-2 text-xs text-gray-500">
        <p>
          ※ 모바일에서는 테이블을 좌우로 스와이프하여 더 많은 데이터를 확인할 수
          있습니다.
        </p>
      </div>
    </div>
  );
}
