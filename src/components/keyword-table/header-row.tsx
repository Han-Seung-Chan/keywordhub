import {
  Draggable,
  Droppable,
} from "@/components/keyword-table/drag-components";
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { HeaderInfo } from "@/types/table";
import { GripVertical } from "lucide-react";

interface HeaderRowProps {
  headers: HeaderInfo[];
  draggable?: boolean;
}

export function HeaderRow({ headers }: HeaderRowProps) {
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
                    <div className="flex h-full items-center justify-center">
                      <div
                        className="mr-1 cursor-grab rounded p-1 hover:bg-gray-200"
                        {...provided.dragHandleProps}
                        title="드래그하여 순서 변경"
                      >
                        <GripVertical className="h-4 w-4 text-gray-500" />
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
