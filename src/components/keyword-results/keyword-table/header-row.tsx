import { TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Draggable, Droppable } from "./drag-components";
import { HeaderInfo } from "@/types/table";

interface HeaderRowProps {
  headers: HeaderInfo[];
  draggable?: boolean;
}

export function HeaderRow({ headers, draggable = false }: HeaderRowProps) {
  // 드래그 기능이 없는 기본 헤더 행
  if (!draggable) {
    return (
      <TableHeader>
        <TableRow className="bg-muted/50">
          {headers.map((header) => (
            <TableHead
              key={header.id}
              className="border border-gray-200 text-center"
            >
              {header.label}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
    );
  }

  // 드래그 가능한 헤더 행
  return (
    <TableHeader>
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
              <Draggable key={header.id} draggableId={header.id} index={index}>
                {(provided, snapshot) => (
                  <TableHead
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    className="border border-gray-200 text-center transition-colors duration-200"
                    style={{
                      ...provided.draggableProps.style,
                      backgroundColor: snapshot.isDragging
                        ? "rgba(209, 213, 219, 0.8)"
                        : undefined,
                      textAlign: "center",
                      justifyContent: "center",
                    }}
                  >
                    <div className="flex items-center justify-center">
                      {/* 드래그 핸들을 명확하게 설정 */}
                      <div
                        className="mr-1 cursor-grab rounded text-sm"
                        {...provided.dragHandleProps}
                      >
                        ≡
                      </div>
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
}
