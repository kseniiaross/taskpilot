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

import DashboardToolbar from "../components/dashboard/tasks/TaskToolbar";


const defaultProps = {
  searchQuery:"",
  filter:"all" as const,
  sort:"newest" as const,
  resultCount:5,
  onSearchChange:vi.fn(),
  onFilterChange:vi.fn(),
  onSortChange:vi.fn(),
  onCreateTask:vi.fn(),
};


describe(
  "DashboardToolbar",
  () => {

    it(
      "renders filter buttons",
      () => {
        render(
          <DashboardToolbar
            {...defaultProps}
          />,
        );


        expect(
          screen.getByRole(
            "button",
            {
              name:"All",
            },
          ),
        ).toBeInTheDocument();


        expect(
          screen.getByRole(
            "button",
            {
              name:"Active",
            },
          ),
        ).toBeInTheDocument();


        expect(
          screen.getByRole(
            "button",
            {
              name:"Completed",
            },
          ),
        ).toBeInTheDocument();
      },
    );


    it(
      "changes filter",
      () => {
        const onFilterChange =
          vi.fn();


        render(
          <DashboardToolbar
            {...defaultProps}
            onFilterChange={
              onFilterChange
            }
          />,
        );


        fireEvent.click(
          screen.getByRole(
            "button",
            {
              name:"Active",
            },
          ),
        );


        expect(
          onFilterChange,
        ).toHaveBeenCalledWith(
          "active",
        );
      },
    );


    it(
      "changes completed filter",
      () => {
        const onFilterChange =
          vi.fn();


        render(
          <DashboardToolbar
            {...defaultProps}
            onFilterChange={
              onFilterChange
            }
          />,
        );


        fireEvent.click(
          screen.getByRole(
            "button",
            {
              name:"Completed",
            },
          ),
        );


        expect(
          onFilterChange,
        ).toHaveBeenCalledWith(
          "completed",
        );
      },
    );


    it(
      "changes sort option",
      () => {
        const onSortChange =
          vi.fn();


        render(
          <DashboardToolbar
            {...defaultProps}
            onSortChange={
              onSortChange
            }
            sort="newest"
          />,
        );


        const select =
          screen.getByRole(
            "combobox",
          );


        fireEvent.change(
          select,
          {
            target:{
              value:"priority",
            },
          },
        );


        expect(
          onSortChange,
        ).toHaveBeenCalledWith(
          "priority",
        );
      },
    );


    it(
      "supports alphabetical sorting",
      () => {
        const onSortChange =
          vi.fn();


        render(
          <DashboardToolbar
            {...defaultProps}
            onSortChange={
              onSortChange
            }
          />,
        );


        fireEvent.change(
          screen.getByRole(
            "combobox",
          ),
          {
            target:{
              value:"alphabetical",
            },
          },
        );


        expect(
          onSortChange,
        ).toHaveBeenCalledWith(
          "alphabetical",
        );
      },
    );


    it(
      "creates new task",
      () => {
        const onCreateTask =
          vi.fn();


        render(
          <DashboardToolbar
            {...defaultProps}
            onCreateTask={
              onCreateTask
            }
          />,
        );


        fireEvent.click(
          screen.getByRole(
            "button",
            {
              name:"Create task",
            },
          ),
        );


        expect(
          onCreateTask,
        ).toHaveBeenCalled();
      },
    );


    it(
      "marks active filter button",
      () => {
        render(
          <DashboardToolbar
            {...defaultProps}
            filter="active"
          />,
        );


        const button =
          screen.getByRole(
            "button",
            {
              name:"Active",
            },
          );


        expect(
          button.className,
        ).toContain(
          "dashboardFilter--active",
        );
      },
    );

  },
);