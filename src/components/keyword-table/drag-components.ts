import dynamic from "next/dynamic";

// SSR 비활성화로 서버 렌더링 문제 방지
export const DragDropContext = dynamic(
  () => import("react-beautiful-dnd").then((mod) => mod.DragDropContext),
  { ssr: false },
);

export const Droppable = dynamic(
  () => import("react-beautiful-dnd").then((mod) => mod.Droppable),
  { ssr: false },
);

export const Draggable = dynamic(
  () => import("react-beautiful-dnd").then((mod) => mod.Draggable),
  { ssr: false },
);
