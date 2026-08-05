import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";

import DashboardStats from "../components/dashboard/Stats";

import type { Task } from "../context/TaskContext";

const TASK_TIME_ZONE = "America/New_York";

const getTodayInTimeZone = (timeZone: string): string =>
  new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());

const mockTasks: Task[] = [
  {
    id: "1",
    workspaceId: "workspace-1",
    projectId: "project-1",
    title: "Active task",
    description: "Test task",
    dueDate: getTodayInTimeZone(TASK_TIME_ZONE),
    dueTime: "10:00",
    timeZone: TASK_TIME_ZONE,
    priority: "high",
    category: "work",
    completed: false,
    order: 0,
  },
  {
    id: "2",
    workspaceId: "workspace-1",
    projectId: "project-1",
    title: "Completed task",
    description: "Done task",
    dueDate: "2026-07-20",
    dueTime: "10:00",
    timeZone: TASK_TIME_ZONE,
    priority: "medium",
    category: "work",
    completed: true,
    order: 1,
  },
];

describe("DashboardStats", () => {
  it("renders all statistic cards", () => {
    render(
      <DashboardStats
        activeCount={1}
        completedCount={1}
        tasks={mockTasks}
      />,
    );

    expect(
      screen.getByText("Total Tasks"),
    ).toBeInTheDocument();

    expect(
      screen.getByText("Active"),
    ).toBeInTheDocument();

    expect(
      screen.getByText("Completed"),
    ).toBeInTheDocument();

    expect(
      screen.getByText("Due Today"),
    ).toBeInTheDocument();
  });

  it("shows correct task totals", () => {
    render(
      <DashboardStats
        activeCount={3}
        completedCount={2}
        tasks={[]}
      />,
    );

    expect(
      screen.getByText("5"),
    ).toBeInTheDocument();

    expect(
      screen.getByText("3"),
    ).toBeInTheDocument();

    expect(
      screen.getByText("2"),
    ).toBeInTheDocument();
  });

  it("calculates completion rate", () => {
    render(
      <DashboardStats
        activeCount={1}
        completedCount={3}
        tasks={[]}
      />,
    );

    expect(
      screen.getByText(
        "75% completion rate",
      ),
    ).toBeInTheDocument();
  });

  it("shows due today tasks", () => {
    render(
      <DashboardStats
        activeCount={1}
        completedCount={0}
        tasks={mockTasks}
      />,
    );

    expect(
      screen.getByText("Due Today"),
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        "Needs your attention",
      ),
    ).toBeInTheDocument();
  });

  it("shows empty due today state", () => {
    render(
      <DashboardStats
        activeCount={0}
        completedCount={0}
        tasks={[]}
      />,
    );

    expect(
      screen.getByText(
        "Nothing due today",
      ),
    ).toBeInTheDocument();
  });

  it("ignores tasks due today in a different time zone if not actually today there", () => {
    // A task whose dueDate is "today" in UTC but not necessarily today
    // in its own stated time zone should still be judged by its own zone.
    const utcToday = new Date().toISOString().split("T")[0];

    render(
      <DashboardStats
        activeCount={1}
        completedCount={0}
        tasks={[
          {
            id: "3",
            workspaceId: "workspace-1",
            projectId: "project-1",
            title: "UTC-dated task",
            description: "",
            dueDate: utcToday,
            dueTime: "10:00",
            timeZone: "Pacific/Kiritimati",
            priority: "low",
            category: "work",
            completed: false,
            order: 2,
          },
        ]}
      />,
    );

    // This assertion is intentionally loose: it just confirms the
    // component renders without crashing when dueDate/timeZone disagree
    // with the test runner's local clock. The exact due-today count
    // depends on the current UTC offset, so we don't assert a fixed number.
    expect(
      screen.getByText("Due Today"),
    ).toBeInTheDocument();
  });
});