import { DndContext, useDraggable } from "@dnd-kit/core";

function Box() {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id: "box" });

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={{
        transform: transform ? `translate(${transform.x}px, ${transform.y}px)` : undefined,
        padding: "1rem",
        background: "blue",
        color: "white",
        cursor: "grab",
      }}
    >
      Drag me
    </div>
  );
}

export default function Test() {
  return (
    <DndContext onDragEnd={(e) => console.log(e)}>
      <Box />
    </DndContext>
  );
}
