import {
  describe,
  expect,
  it,
  beforeEach,
} from "vitest";

import {
  renderHook,
  act,
} from "@testing-library/react";

import {
  useContext,
} from "react";

import {
  ProjectProvider,
  ProjectContext,
  type Project,
} from "../context/ProjectContext";


const mockProject: Project = {
  id: "project-1",
  workspaceId: "workspace-1",
  name: "TaskPilot",
  description: "Dashboard project",
  color: "#5b5ce2",
  createdAt: "2026-07-26T00:00:00.000Z",
};


const wrapper = ({
  children,
}: {
  children: React.ReactNode;
}) => (
  <ProjectProvider>
    {children}
  </ProjectProvider>
);


const useProjectContext = () => {
  const context =
    useContext(ProjectContext);

  if (!context) {
    throw new Error(
      "ProjectContext missing",
    );
  }

  return context;
};


describe("ProjectContext", () => {

  beforeEach(() => {
    localStorage.clear();
  });


  it("adds a project", () => {
    const {
      result,
    } = renderHook(
      () => useProjectContext(),
      {
        wrapper,
      },
    );


    act(() => {
      result.current.dispatch({
        type: "ADD_PROJECT",
        project: mockProject,
      });
    });


    expect(
      result.current.projects.length,
    ).toBe(1);


    expect(
      result.current.projects[0].name,
    ).toBe(
      "TaskPilot",
    );
  });


  it("updates a project", () => {
    const {
      result,
    } = renderHook(
      () => useProjectContext(),
      {
        wrapper,
      },
    );


    act(() => {
      result.current.dispatch({
        type: "ADD_PROJECT",
        project: mockProject,
      });
    });


    act(() => {
      result.current.dispatch({
        type: "UPDATE_PROJECT",
        project:{
          ...mockProject,
          name:"Updated Project",
        },
      });
    });


    expect(
      result.current.projects[0].name,
    ).toBe(
      "Updated Project",
    );
  });


  it("deletes a project", () => {
    const {
      result,
    } = renderHook(
      () => useProjectContext(),
      {
        wrapper,
      },
    );


    act(() => {
      result.current.dispatch({
        type: "ADD_PROJECT",
        project: mockProject,
      });
    });


    act(() => {
      result.current.dispatch({
        type: "DELETE_PROJECT",
        id:"project-1",
      });
    });


    expect(
      result.current.projects.length,
    ).toBe(0);
  });


  it("finds project by id", () => {
    const {
      result,
    } = renderHook(
      () => useProjectContext(),
      {
        wrapper,
      },
    );


    act(() => {
      result.current.dispatch({
        type: "ADD_PROJECT",
        project: mockProject,
      });
    });


    const project =
      result.current.getProjectById(
        "project-1",
      );


    expect(
      project?.name,
    ).toBe(
      "TaskPilot",
    );
  });

});