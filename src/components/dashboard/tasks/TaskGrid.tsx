import {
  SortableContext,
  rectSortingStrategy,
} from "@dnd-kit/sortable";

import {
  CheckCircle2,
  Search,
} from "lucide-react";

import type {
  Task,
} from "../../../context/TaskContext";

import {
  useProjects,
} from "../../../context/ProjectContext";

import TaskCard from "./TaskCard";

interface TaskGridProps {
  tasks: Task[];
  hasAnyTasks: boolean;
  hideDrag?: boolean;
  onComplete: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (task: Task) => void;
  onCreateTask: () => void;
}

const TaskGrid = ({
  tasks,
  hasAnyTasks,
  hideDrag = false,
  onComplete,
  onDelete,
  onEdit,
  onCreateTask,
}: TaskGridProps) => {
  const { getProjectById } = useProjects();

  const sortableItems = tasks.map(
    ({ id }) => id,
  );

  const emptyTitle = hasAnyTasks
    ? "No matching tasks"
    : "Your workspace is clear";

  const emptyDescription = hasAnyTasks
    ? "Try changing your search or selecting another filter."
    : "Create your first task and start organizing your work.";

  if (tasks.length === 0) {
    return (
      <section className="taskEmptyState">
        <span
          className="taskEmptyState__icon"
          aria-hidden="true"
        >
          {hasAnyTasks ? (
            <Search size={28} />
          ) : (
            <CheckCircle2 size={28} />
          )}
        </span>

        <h3>{emptyTitle}</h3>

        <p>{emptyDescription}</p>

        {!hasAnyTasks && (
          <button
            type="button"
            className="dashboardPrimaryButton"
            onClick={onCreateTask}
          >
            Create first task
          </button>
        )}
      </section>
    );
  }

  return (
    <SortableContext
      items={sortableItems}
      strategy={rectSortingStrategy}
    >
      <section className="taskGrid">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            hideDrag={hideDrag}
            projectLabel={
              task.projectId
                ? getProjectById(task.projectId)?.name ?? "No project"
                : "No project"
            }
            onComplete={onComplete}
            onDelete={onDelete}
            onEdit={onEdit}
          />
        ))}
      </section>
    </SortableContext>
  );
};

export default TaskGrid;