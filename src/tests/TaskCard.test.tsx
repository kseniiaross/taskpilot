import { describe, expect, it, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";

import TaskCard from "../components/dashboard/tasks/TaskCard";

import type { Task } from "../context/TaskContext";

vi.mock("@dnd-kit/sortable", () => ({
  useSortable: () => ({
    attributes: {},
    listeners: {},
    setNodeRef: vi.fn(),
    transform: null,
    transition: undefined,
    isDragging: false,
  }),
}));

const TASK_TIME_ZONE = "America/New_York";

const getTodayInTimeZone = (timeZone: string): string =>
  new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());

const activeTask: Task = {
  id: "task-1",
  workspaceId: "workspace-1",
  projectId: "project-1",
  title: "Build TaskPilot",
  description: "Create dashboard components",
  dueDate: getTodayInTimeZone(TASK_TIME_ZONE),
  dueTime: "10:00",
  timeZone: TASK_TIME_ZONE,
  priority: "high",
  category: "work",
  completed: false,
  order: 0,
};

const completedTask: Task = {
  ...activeTask,
  id: "task-2",
  title: "Completed Task",
  completed: true,
};

describe("TaskCard", () => {
  it("renders active task information", () => {
    render(
      <TaskCard
        task={activeTask}
        onComplete={vi.fn()}
        onDelete={vi.fn()}
        onEdit={vi.fn()}
      />,
    );

    expect(
      screen.getByText("Build TaskPilot"),
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        "Create dashboard components",
      ),
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        "Active",
      ),
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        "Work",
      ),
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        "high",
      ),
    ).toBeInTheDocument();
  });

  it("shows due today badge using the task's own time zone", () => {
    render(
      <TaskCard
        task={activeTask}
        onComplete={vi.fn()}
        onDelete={vi.fn()}
        onEdit={vi.fn()}
      />,
    );

    expect(
      screen.getByText("Due today"),
    ).toBeInTheDocument();
  });

  it("calls complete callback", () => {
    const onComplete = vi.fn();

    render(
      <TaskCard
        task={activeTask}
        onComplete={onComplete}
        onDelete={vi.fn()}
        onEdit={vi.fn()}
      />,
    );

    fireEvent.click(
      screen.getByRole(
        "button",
        {
          name:"Complete",
        },
      ),
    );

    expect(
      onComplete,
    ).toHaveBeenCalledWith(
      "task-1",
    );
  });

  it("calls delete callback", () => {
    const onDelete = vi.fn();

    render(
      <TaskCard
        task={activeTask}
        onComplete={vi.fn()}
        onDelete={onDelete}
        onEdit={vi.fn()}
      />,
    );

    fireEvent.click(
      screen.getByRole(
        "button",
        {
          name:"Delete",
        },
      ),
    );

    expect(
      onDelete,
    ).toHaveBeenCalledWith(
      "task-1",
    );
  });

  it("calls edit callback", () => {
    const onEdit = vi.fn();

    render(
      <TaskCard
        task={activeTask}
        onComplete={vi.fn()}
        onDelete={vi.fn()}
        onEdit={onEdit}
      />,
    );

    fireEvent.click(
      screen.getByRole(
        "button",
        {
          name:"Edit",
        },
      ),
    );

    expect(
      onEdit,
    ).toHaveBeenCalledWith(
      activeTask,
    );
  });

  it("renders completed state", () => {
    render(
      <TaskCard
        task={completedTask}
        onComplete={vi.fn()}
        onDelete={vi.fn()}
        onEdit={vi.fn()}
      />,
    );

    expect(
      screen.getByText(
        "Completed",
        {
          selector:
            ".taskCard__status",
        },
      ),
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        /Task Completed/,
      ),
    ).toBeInTheDocument();

    expect(
      screen.queryByRole(
        "button",
        {
          name:"Edit",
        },
      ),
    ).not.toBeInTheDocument();
  });

  it("shows missing description fallback", () => {
    render(
      <TaskCard
        task={{
          ...activeTask,
          description:"",
        }}
        onComplete={vi.fn()}
        onDelete={vi.fn()}
        onEdit={vi.fn()}
      />,
    );

    expect(
      screen.getByText(
        "No description was added for this task.",
      ),
    ).toBeInTheDocument();
  });
});