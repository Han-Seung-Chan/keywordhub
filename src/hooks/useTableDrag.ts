import { useState, useEffect, useCallback, useMemo } from "react";
import { HeaderInfo } from "@/types/table";

const LOCAL_STORAGE_KEY = "keyword-table-headers";

interface UseTableDragProps {
  initialHeaders: HeaderInfo[]; // 초기 헤더 상태를 저장하기 위한 prop
}

export function useTableDrag({ initialHeaders }: UseTableDragProps) {
  const [headers, setHeaders] = useState<HeaderInfo[]>(initialHeaders);
  const [draggingHeaderId, setDraggingHeaderId] = useState<string | null>(null);

  // 컴포넌트 마운트 시 로컬 스토리지에서 헤더 순서 불러오기
  useEffect(() => {
    try {
      const savedHeaders = localStorage.getItem(LOCAL_STORAGE_KEY);

      if (!savedHeaders) return;

      const parsedHeaders = JSON.parse(savedHeaders);

      // 헤더 아이디 목록 검증 (새로운 헤더가 추가되었을 수 있음)
      const initialHeaderIds = new Set(initialHeaders.map((h) => h.id));
      const savedHeaderIds = new Set(parsedHeaders.map((h) => h.id));

      // 모든 초기 헤더가 저장된 헤더에 있는지 확인
      const allHeadersExist = Array.from(initialHeaderIds).every((id) =>
        savedHeaderIds.has(id),
      );

      if (allHeadersExist) {
        setHeaders(parsedHeaders);
      }
    } catch (error) {
      console.error("헤더 설정을 불러오는 중 오류가 발생했습니다:", error);
    }
  }, [initialHeaders]);

  // 헤더 ID 메모이제이션
  const headerIds = useMemo(() => {
    return headers.map((header) => header.id);
  }, [headers]);

  // 드래그 시작 핸들러
  const onDragStart = useCallback((start: any) => {
    setDraggingHeaderId(start.draggableId);
  }, []);

  // 드래그 앤 드롭 이벤트 핸들러
  const onDragEnd = useCallback(
    (result: any) => {
      setDraggingHeaderId(null);

      // 드롭 영역 밖으로 드래그된 경우
      if (!result.destination) {
        return;
      }

      // 위치가 변경되지 않은 경우
      if (result.destination.index === result.source.index) {
        return;
      }

      // 헤더 배열 복사
      const newHeaders = Array.from(headers);
      // 드래그된 항목 제거
      const [removed] = newHeaders.splice(result.source.index, 1);
      // 새 위치에 삽입
      newHeaders.splice(result.destination.index, 0, removed);

      // 상태 업데이트
      setHeaders(newHeaders);

      // 로컬 스토리지에 새 헤더 순서 저장
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newHeaders));
      } catch (error) {
        console.error("헤더 설정을 저장하는 중 오류가 발생했습니다:", error);
      }
    },
    [headers],
  );

  // 헤더 순서 초기화 함수
  const resetHeaderOrder = useCallback(() => {
    setHeaders(initialHeaders);
    localStorage.removeItem(LOCAL_STORAGE_KEY);
  }, [initialHeaders]);

  return {
    headers,
    headerIds,
    draggingHeaderId,
    onDragStart,
    onDragEnd,
    resetHeaderOrder,
  };
}
