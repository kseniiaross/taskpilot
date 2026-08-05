import { describe, expect, it, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useContext } from "react";

import {
  TaskProvider,
  TaskContext,
  type Task,
} from "../context/TaskContext";

const mockTask: Task = {
  id: "task-1",
  workspaceId: "workspace-1",
  projectId: "project-1",
  title: "Create dashboard",
  description: "Build TaskPilot dashboard",
  dueDate: "2026-07-30",
  dueTime: "10:00",
  timeZone: "America/New_York",
  priority: "high",
  category: "work",
  completed: false,
  order: 0,
};

const completedTask: Task = {
  ...mockTask,
  id: "task-2",
  completed: true,
};

const wrapper = ({
  children,
}: {
  children: React.ReactNode;
}) => (
  <TaskProvider>
    {children}
  </TaskProvider>
);

const useTask = () => {
  const context = useContext(TaskContext);

  if (!context) {
    throw new Error("Missing TaskContext");
  }

  return context;
};

describe("TaskContext", () => {
  beforeEach(() => {
    localStorage.clear();
  });


  it("loads tasks from localStorage", () => {
    localStorage.setItem(
      "taskpilot-tasks",
      JSON.stringify({
        tasks: [mockTask],
        completedTasks: [],
      }),
    );

    const { result } = renderHook(
      () => useTask(),
      {
        wrapper,
      },
    );

    expect(
      result.current.state.tasks,
    ).toHaveLength(1);
  });


  it("adds task", () => {
    const { result } = renderHook(
      () => useTask(),
      {
        wrapper,
      },
    );

    act(() => {
      result.current.dispatch({
        type: "ADD_TASK",
        task: mockTask,
      });
    });

    expect(
      result.current.state.tasks,
    ).toHaveLength(1);

    expect(
      result.current.state.tasks[0].completed,
    ).toBe(false);
  });


  it("assigns increasing order to newly added tasks", () => {
    const { result } = renderHook(
      () => useTask(),
      {
        wrapper,
      },
    );

    act(() => {
      result.current.dispatch({
        type: "ADD_TASK",
        task: mockTask,
      });

      result.current.dispatch({
        type: "ADD_TASK",
        task: {
          ...mockTask,
          id: "task-2",
          title: "Second task",
        },
      });
    });

    const [firstTask, secondTask] =
      result.current.state.tasks;

    expect(
      secondTask.order,
    ).toBeGreaterThan(
      firstTask.order,
    );
  });


  it("completes task", () => {
    const { result } = renderHook(
      () => useTask(),
      {
        wrapper,
      },
    );

    act(() => {
      result.current.dispatch({
        type: "ADD_TASK",
        task: mockTask,
      });

      result.current.dispatch({
        type: "COMPLETE_TASK",
        id: "task-1",
      });
    });

    expect(
      result.current.state.tasks,
    ).toHaveLength(0);

    expect(
      result.current.state.completedTasks,
    ).toHaveLength(1);
  });


  it("does nothing when completing missing task", () => {
    const { result } = renderHook(
      () => useTask(),
      {
        wrapper,
      },
    );

    act(() => {
      result.current.dispatch({
        type: "COMPLETE_TASK",
        id: "wrong-id",
      });
    });

    expect(
      result.current.state.tasks,
    ).toHaveLength(0);
  });


  it("toggles completed task back to active", () => {
    const { result } = renderHook(
      () => useTask(),
      {
        wrapper,
      },
    );

    act(() => {
      result.current.dispatch({
        type: "ADD_TASK",
        task: mockTask,
      });

      result.current.dispatch({
        type: "COMPLETE_TASK",
        id: "task-1",
      });

      result.current.dispatch({
        type: "TOGGLE_TASK",
        id: "task-1",
      });
    });

    expect(
      result.current.state.tasks,
    ).toHaveLength(1);

    expect(
      result.current.state.completedTasks,
    ).toHaveLength(0);
  });


  it("edits active task", () => {
    const { result } = renderHook(
      () => useTask(),
      {
        wrapper,
      },
    );

    act(() => {
      result.current.dispatch({
        type: "ADD_TASK",
        task: mockTask,
      });

      result.current.dispatch({
        type: "EDIT_TASK",
        task:{
          ...mockTask,
          title:"Updated task",
        },
      });
    });

    expect(
      result.current.state.tasks[0].title,
    ).toBe("Updated task");
  });


  it("moves edited task from active to completed", () => {
    const { result } = renderHook(
      () => useTask(),
      {
        wrapper,
      },
    );

    act(() => {
      result.current.dispatch({
        type:"ADD_TASK",
        task:mockTask,
      });

      result.current.dispatch({
        type:"EDIT_TASK",
        task:{
          ...mockTask,
          completed:true,
        },
      });
    });

    expect(
      result.current.state.tasks,
    ).toHaveLength(0);

    expect(
      result.current.state.completedTasks,
    ).toHaveLength(1);
  });


  it("deletes completed task", () => {
    const { result } = renderHook(
      () => useTask(),
      {
        wrapper,
      },
    );

    act(() => {
      result.current.dispatch({
        type:"ADD_TASK",
        task:completedTask,
      });

      result.current.dispatch({
        type:"DELETE_TASK",
        id:"task-2",
      });
    });

    expect(
      result.current.state.completedTasks,
    ).toHaveLength(0);
  });


  it("reorders active tasks and reassigns order", () => {
    const { result } = renderHook(
      () => useTask(),
      {
        wrapper,
      },
    );

    act(() => {
      result.current.dispatch({
        type:"ADD_TASK",
        task:mockTask,
      });

      result.current.dispatch({
        type:"ADD_TASK",
        task:{
          ...mockTask,
          id:"task-2",
          title:"Second task",
        },
      });
    });

    const [firstTask, secondTask] =
      result.current.state.tasks;

    act(() => {
      result.current.dispatch({
        type:"REORDER_TASKS",
        scope:"active",
        reorderedList:[
          secondTask,
          firstTask,
        ],
      });
    });

    expect(
      result.current.state.tasks[0].id,
    ).toBe("task-2");

    expect(
      result.current.state.tasks[0].order,
    ).toBeGreaterThan(
      result.current.state.tasks[1].order,
    );
  });


  it("reordering active tasks does not affect completed tasks", () => {
    const { result } = renderHook(
      () => useTask(),
      {
        wrapper,
      },
    );

    act(() => {
      result.current.dispatch({
        type:"ADD_TASK",
        task:mockTask,
      });

      result.current.dispatch({
        type:"COMPLETE_TASK",
        id:"task-1",
      });
    });

    const completedBefore =
      result.current.state.completedTasks[0];

    act(() => {
      result.current.dispatch({
        type:"REORDER_TASKS",
        scope:"active",
        reorderedList:[],
      });
    });

    expect(
      result.current.state.completedTasks[0],
    ).toEqual(completedBefore);
  });


  it("ignores unknown action", () => {
  const { result } = renderHook(
    () => useTask(),
    {
      wrapper,
    },
  );

  act(() => {
    result.current.dispatch(
      {
        type:"UNKNOWN",
      } as never,
    );
  });

  expect(
    result.current.state.tasks,
  ).toHaveLength(0);
});
});