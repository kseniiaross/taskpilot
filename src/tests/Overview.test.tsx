import {
  describe,
  expect,
  it,
  beforeEach,
} from "vitest";

import {
  render,
  screen,
  fireEvent,
} from "@testing-library/react";

import {
  MemoryRouter,
} from "react-router-dom";

import {
  TaskProvider,
} from "../context/TaskContext";

import {
  AuthContext,
  type AuthContextType,
} from "../context/AuthContext";

import {
  ProjectProvider,
} from "../context/ProjectContext";

import Overview from "../pages/Overview";

const mockUser = {
  id: "user-1",
  email: "kseniia@test.com",
  password: "test-password-1",
  fullName: "Kseniia Developer",
  activeWorkspaceId: "workspace-1",
  workspaces: [
    {
      id: "workspace-1",
      name: "Personal Workspace",
      color: "#000000",
    },
  ],
};

const mockAuthValue: AuthContextType = {
  user: mockUser,
  authenticated: true,
  loginUser: () => {},
  logoutUser: () => {},
  refreshUser: () => {},
  updateCurrentUser: () => {},
  updateWorkspaceName: () => {},
  updateWorkspaceColor: () => {},
  createNewWorkspace: () => {},
  switchCurrentWorkspace: () => {},
  deleteCurrentAccount: () => {},
};

const renderDashboard = () =>
  render(
    <MemoryRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <AuthContext.Provider
        value={mockAuthValue}
      >
        <TaskProvider>
          <ProjectProvider>
            <Overview />
          </ProjectProvider>
        </TaskProvider>
      </AuthContext.Provider>
    </MemoryRouter>,
  );

describe(
  "Overview",
  () => {
    beforeEach(() => {
      localStorage.clear();
    });

    it(
      "renders dashboard greeting",
      () => {
        renderDashboard();

        expect(
          screen.getByText(
            /Good Morning|Good Afternoon|Good Evening/,
          ),
        ).toBeInTheDocument();
      },
    );

    it(
      "renders workspace name",
      () => {
        renderDashboard();

        expect(
          screen.getByText(
            "Personal Workspace",
          ),
        ).toBeInTheDocument();
      },
    );

    it(
      "opens create task modal",
      () => {
        renderDashboard();

        fireEvent.click(
          screen.getByRole(
            "button",
            {
              name:/New Task/i,
            },
          ),
        );

        expect(
          screen.getByRole(
            "dialog",
          ),
        ).toBeInTheDocument();
      },
    );

    it(
      "shows task fields",
      () => {
        renderDashboard();

        fireEvent.click(
          screen.getByRole(
            "button",
            {
              name:/New Task/i,
            },
          ),
        );

        expect(
          screen.getByLabelText(
            /title/i,
          ),
        ).toBeInTheDocument();

        expect(
          screen.getByLabelText(
            /description/i,
          ),
        ).toBeInTheDocument();
      },
    );
  },
);