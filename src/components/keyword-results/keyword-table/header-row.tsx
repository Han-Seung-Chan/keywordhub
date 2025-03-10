import { TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Draggable, Droppable } from "./drag-components";
import { HeaderInfo } from "@/types/table";

interface HeaderRowProps {
  headers: HeaderInfo[];
  draggable?: boolean;
}

export function HeaderRow({ headers }: HeaderRowProps) {
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
                    <div className="flex h-full items-center justify-center">
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
