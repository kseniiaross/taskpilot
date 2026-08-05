import {
  describe,
  expect,
  it,
  vi,
} from "vitest";

import {
  render,
  screen,
  fireEvent,
} from "@testing-library/react";

import {
  ProjectProvider,
} from "../context/ProjectContext";

import TaskModal from "../components/dashboard/tasks/TaskModal";

import type { Task } from "../context/TaskContext";


const mockTask: Task = {
  id: "task-1",
  workspaceId: "workspace-1",
  projectId: "project-1",
  title: "Existing Task",
  description: "Existing description",
  dueDate: "2026-07-30",
  dueTime: "10:00",
  timeZone: "America/New_York",
  priority: "high",
  category: "work",
  completed: false,
  order: 0,
};


const renderModal = (
  task:Task|null=null,
  onSubmit=vi.fn(),
  onClose=vi.fn(),
) =>
  render(
    <ProjectProvider>
      <TaskModal
        task={task}
        onSubmit={onSubmit}
        onClose={onClose}
      />
    </ProjectProvider>,
  );


describe(
  "TaskModal",
  () => {

    it(
      "renders create mode",
      () => {
        renderModal();

        expect(
          screen.getByText(
            "Create New Task",
          ),
        ).toBeInTheDocument();

        expect(
          screen.getByLabelText(
            /Task Title/i,
          ),
        ).toBeInTheDocument();
      },
    );


    it(
      "submit button disabled without required fields",
      () => {
        renderModal();

        expect(
          screen.getByRole(
            "button",
            {
              name:/Create Task/i,
            },
          ),
        ).toBeDisabled();
      },
    );


    it(
      "creates task with form data",
      () => {
        const onSubmit = vi.fn();

        renderModal(
          null,
          onSubmit,
        );


        fireEvent.change(
          screen.getByLabelText(
            /Task Title/i,
          ),
          {
            target:{
              value:"Build portfolio",
            },
          },
        );


        fireEvent.change(
          screen.getByLabelText(
            /Due Date/i,
          ),
          {
            target:{
              value:"2026-07-30",
            },
          },
        );


        fireEvent.click(
          screen.getByRole(
            "button",
            {
              name:/Create Task/i,
            },
          ),
        );


        expect(
          onSubmit,
        ).toHaveBeenCalledWith(
          "Build portfolio",
          "",
          "2026-07-30",
          "",
          expect.any(String),
          "medium",
          "project",
          "",
        );
      },
    );


    it(
      "changes priority and category",
      () => {
        const onSubmit = vi.fn();

        renderModal(
          null,
          onSubmit,
        );


        fireEvent.change(
          screen.getByLabelText(
            /Task Title/i,
          ),
          {
            target:{
              value:"Testing",
            },
          },
        );


        fireEvent.change(
          screen.getByLabelText(
            /Due Date/i,
          ),
          {
            target:{
              value:"2026-07-30",
            },
          },
        );


        const selects =
          screen.getAllByRole(
            "combobox",
          );


        fireEvent.change(
          selects[1],
          {
            target:{
              value:"high",
            },
          },
        );


        fireEvent.change(
          selects[2],
          {
            target:{
              value:"health",
            },
          },
        );


        fireEvent.click(
          screen.getByRole(
            "button",
            {
              name:/Create Task/i,
            },
          ),
        );


        expect(
          onSubmit,
        ).toHaveBeenCalledWith(
          "Testing",
          "",
          "2026-07-30",
          "",
          expect.any(String),
          "high",
          "health",
          "",
        );
      },
    );


    it(
      "renders edit mode",
      () => {
        renderModal(
          mockTask,
        );


        expect(
          screen.getByText(
            "Edit Task",
          ),
        ).toBeInTheDocument();


        expect(
          screen.getByDisplayValue(
            "Existing Task",
          ),
        ).toBeInTheDocument();


        expect(
          screen.getByRole(
            "button",
            {
              name:/Save Changes/i,
            },
          ),
        ).toBeInTheDocument();
      },
    );


    it(
      "closes with close button",
      () => {
        const onClose = vi.fn();

        renderModal(
          null,
          vi.fn(),
          onClose,
        );


        fireEvent.click(
          screen.getByRole(
            "button",
            {
              name:/Close task modal/i,
            },
          ),
        );


        expect(
          onClose,
        ).toHaveBeenCalled();
      },
    );


    it(
      "closes with Escape key",
      () => {
        const onClose = vi.fn();

        renderModal(
          null,
          vi.fn(),
          onClose,
        );


        fireEvent.keyDown(
          document,
          {
            key:"Escape",
          },
        );


        expect(
          onClose,
        ).toHaveBeenCalled();
      },
    );

  },
);