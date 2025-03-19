import { memo, useCallback } from "react";
import {
  Draggable,
  Droppable,
} from "@/components/keyword-table/drag-components";
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { HeaderInfo } from "@/types/table";
import { GripVertical } from "lucide-react";

interface HeaderRowProps {
  headers: HeaderInfo[];
}

// memo로 컴포넌트 감싸기
export const HeaderRow = memo(({ headers }: HeaderRowProps) => {
  // 드래그 핸들 렌더링 함수 - 불필요한 리렌더링 방지
  const renderDragHandle = useCallback((provided: any) => {
    return (
      <div
        className="mr-1 cursor-grab rounded hover:bg-gray-200"
        {...provided.dragHandleProps}
        title="드래그하여 순서 변경"
      >
        <GripVertical className="h-4 w-4 text-gray-500" />
      </div>
    );
  }, []);

  return (
    <TableHeader className="sticky top-0 z-20">
      <Droppable
        droppableId="main-headers"
        direction="horizontal"
        isDropDisabled={false}
        isCombineEnabled={false}
        ignoreContainerClipping={false}
      >
        {(provided) => (
          <TableRow
            className="bg-muted/50"
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {headers.map((header, index) => (
              <Draggable
                key={header.id}
                draggableId={header.id}
                index={index}
                shouldRespectForcePress={true}
              >
                {(provided, snapshot) => (
                  <TableHead
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    className="border border-gray-200 px-1 text-center transition-colors duration-200"
                    style={{
                      ...provided.draggableProps.style,
                      backgroundColor: snapshot.isDragging
                        ? "rgba(209, 213, 219, 0.8)"
                        : undefined,
                      textAlign: "center",
                      justifyContent: "center",
                    }}
                  >
                    <div className="flex h-full items-center justify-center">
                      {renderDragHandle(provided)}
                      {header.label}
                    </div>
                  </TableHead>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </TableRow>
        )}
      </Droppable>
    </TableHeader>
  );
});

// displayName 설정
HeaderRow.displayName = "HeaderRow";
