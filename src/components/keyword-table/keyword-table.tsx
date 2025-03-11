"use client";

import { useState, useEffect, useRef } from "react";
import { Table } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
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
      <div className="my-2 flex justify-end">
        <Button
          variant="outline"
          size="sm"
          onClick={resetHeaderOrder}
          className="text-xs"
        >
          <RefreshCw className="mr-1 h-3 w-3" /> 테이블 순서 초기화
        </Button>
      </div>
      <div className="overflow-auto rounded-md border">
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
    </div>
  );
}
