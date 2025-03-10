"use client";

import { useState, useEffect, useRef } from "react";
import { Table } from "@/components/ui/table";
import { useTableDrag } from "@/hooks/useTableDrag";
import { HeaderInfo, KeywordData } from "@/types/table";
import { DragDropContext } from "@/components/keyword-results/keyword-table/drag-components";
import { HeaderRow } from "@/components/keyword-results/keyword-table/header-row";
import { DataRows } from "@/components/keyword-results/keyword-table/data-rows";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
export default function KeywordTable({
  keywordData = [],
}: {
  keywordData?: KeywordData[];
}) {
  const [isClient, setIsClient] = useState(false);

  const initialHeadersRef = useRef<HeaderInfo[]>([
    {
      id: "no",
      label: "NO",
      dataKey: "id",
    },
    {
      id: "keyword",
      label: "키워드",
      dataKey: "keyword",
    },
    {
      id: "yearPcGraph",
      label: "PC 1년 검색량",
      dataKey: "yearPcGraph",
    },
    {
      id: "monthlyPcQcCnt",
      label: "월간 PC 검색량",
      dataKey: "monthlyPcQcCnt",
    },
    {
      id: "monthlyAvePcClkCnt",
      label: "월간 PC 클릭 수",
      dataKey: "monthlyAvePcClkCnt",
    },
    {
      id: "monthlyAvePcCtr",
      label: "월간 PC CTR",
      dataKey: "monthlyAvePcCtr",
    },
    {
      id: "yearMoGraph",
      label: "MO 1년 검색량",
      dataKey: "yearMoGraph",
    },
    {
      id: "monthlyMobileQcCnt",
      label: "월간 MO 검색량",
      dataKey: "monthlyMobileQcCnt",
    },
    {
      id: "monthlyAveMobileClkCnt",
      label: "월간 MO 클릭 수",
      dataKey: "monthlyAveMobileClkCnt",
    },
    {
      id: "monthlyAveMobileCtr",
      label: "월간 MO CTR",
      dataKey: "monthlyAveMobileCtr",
    },
    {
      id: "compIdx",
      label: "경쟁 정도",
      dataKey: "compIdx",
    },
    {
      id: "plAvgDepth",
      label: "월간 광고 노출 수",
      dataKey: "plAvgDepth",
    },
  ]);

  // 헤더 상태 정의 - 각 헤더에 고유한 데이터 키 매핑 추가
  const [headers, setHeaders] = useState<HeaderInfo[]>(
    initialHeadersRef.current,
  );

  const { draggingHeaderId, onDragStart, onDragEnd, resetHeaderOrder } =
    useTableDrag({
      headers,
      setHeaders,
      initialHeaders: initialHeadersRef.current,
    });

  useEffect(() => {
    setIsClient(true);
  }, []);

  // 클라이언트 사이드에서만 드래그 앤 드롭 컴포넌트 렌더링
  if (!isClient) {
    return <></>;
  }

  return (
    <div className="w-full">
      <div className="mb-2 flex justify-end">
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
