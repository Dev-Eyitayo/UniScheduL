import { useState } from "react";
import {
  DndContext,
  useDraggable,
  useDroppable,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  closestCenter,
} from "@dnd-kit/core";

const levels = ["100L", "200L", "300L"];
const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const dummyCourses = {
  "100L": [
    { id: "csc101", title: "Intro to CS" },
    { id: "mth101", title: "Calculus I" },
    { id: "phy101", title: "Physics I" },
  ],
  "200L": [
    { id: "csc201", title: "Data Structures" },
    { id: "mth201", title: "Linear Algebra" },
  ],
  "300L": [
    { id: "csc301", title: "Operating Systems" },
    { id: "csc302", title: "Networks" },
  ],
};

function DraggableCourse({ course }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: course.id,
    data: { course },
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={style}
      className='draggable bg-blue-600 text-white px-3 py-2 rounded-md mb-2 shadow cursor-grab active:cursor-grabbing'
    >
      {course.title}
    </div>
  );
}

function DroppableCell({ id, children }) {
  const { setNodeRef, isOver } = useDroppable({
    id,
  });

  return (
    <td
      ref={setNodeRef}
      className={`relative border border-gray-200 p-0 ${
        isOver ? "bg-green-100" : "bg-white"
      }`}
    >
      <div className='h-full min-h-[80px] p-1'>{children}</div>
    </td>
  );
}

export default function Timetable() {
  const [selectedLevel, setSelectedLevel] = useState("");
  const [startTime, setStartTime] = useState("08:00");
  const [placedCourses, setPlacedCourses] = useState({});
  const [activeId, setActiveId] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 3, // Require 3px movement before dragging starts
        delay: 100, // Add a small delay to distinguish from clicks
        tolerance: 5, // Add some tolerance for touch devices
      },
    })
  );

  function handleDragStart(event) {
    setActiveId(event.active.id);
  }

  function handleDragEnd(event) {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const activeCourse = dummyCourses[selectedLevel]?.find(
        (c) => c.id === active.id
      );

      if (activeCourse) {
        setPlacedCourses((prev) => ({
          ...prev,
          [over.id]: activeCourse,
        }));
      }
    }

    setActiveId(null);
  }

  const times = Array.from({ length: 8 }, (_, i) => {
    const hour = new Date(`1970-01-01T${startTime}:00`);
    hour.setHours(hour.getHours() + i);
    return hour.toTimeString().slice(0, 5);
  });

  const activeCourse = activeId
    ? dummyCourses[selectedLevel]?.find((c) => c.id === activeId)
    : null;

  return (
    <div className='min-h-screen bg-gray-100 p-4 max-w-7xl mx-auto font-sans'>
      {/* Controls */}
      <div className='flex flex-col sm:flex-row gap-4 mb-6 p-4 bg-white rounded-lg shadow-md'>
        <div className='flex flex-col'>
          <label className='text-sm font-medium mb-1 text-gray-700'>
            Select Level
          </label>
          <select
            className='border border-gray-300 p-2 rounded-md bg-gray-50 focus:ring-2 focus:ring-blue-500'
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value)}
          >
            <option value=''>Choose Level</option>
            {levels.map((lvl) => (
              <option key={lvl} value={lvl}>
                {lvl}
              </option>
            ))}
          </select>
        </div>
        <div className='flex flex-col'>
          <label className='text-sm font-medium mb-1 text-gray-700'>
            Start Time
          </label>
          <input
            type='time'
            className='border border-gray-300 p-2 rounded-md bg-gray-50 focus:ring-2 focus:ring-blue-500'
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
          />
        </div>
      </div>

      {/* Courses */}
      <div className='border p-4 mb-6 bg-white rounded-lg shadow-md min-h-[100px]'>
        <h2 className='text-lg font-semibold mb-2'>Available Courses</h2>
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2'>
          {selectedLevel &&
            dummyCourses[selectedLevel]?.map((course) => (
              <DraggableCourse key={course.id} course={course} />
            ))}
        </div>
      </div>

      {/* Timetable */}
      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        collisionDetection={closestCenter}
      >
        <div className='w-full overflow-x-auto'>
          <table className='min-w-full border-collapse text-center text-sm bg-white rounded shadow-md'>
            <thead>
              <tr className='bg-blue-100 sticky top-0 z-10'>
                <th className='p-3 border border-gray-200 font-semibold'>
                  Day/Time
                </th>
                {times.map((time) => (
                  <th
                    key={time}
                    className='p-3 border border-gray-200 font-medium'
                  >
                    {time}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {days.map((day) => (
                <tr key={day}>
                  <td className='p-3 border border-gray-200 bg-blue-50 font-semibold text-blue-800'>
                    {day}
                  </td>
                  {times.map((time) => {
                    const slotId = `${day}-${time}`;
                    const courseInSlot = placedCourses[slotId];

                    return (
                      <DroppableCell key={slotId} id={slotId}>
                        {courseInSlot && (
                          <div className='bg-blue-600 text-white p-2 rounded shadow text-xs'>
                            {courseInSlot.title}
                          </div>
                        )}
                      </DroppableCell>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <DragOverlay>
          {activeCourse ? (
            <div className='bg-blue-600 text-white px-3 py-2 rounded-md shadow cursor-grabbing'>
              {activeCourse.title}
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
