import {
  NavLink,
} from "react-router-dom";

import {
  BarChart3,
  CalendarDays,
  CheckSquare,
  ChevronLeft,
  ChevronRight,
  FolderKanban,
  LayoutDashboard,
  Settings,
  User,
} from "lucide-react";

interface DashboardSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

const navLinkClass = ({
  isActive,
}: {
  isActive: boolean;
}) =>
  `dashboardSidebar__link${
    isActive ? " active" : ""
  }`;

const DashboardSidebar = ({
  collapsed,
  onToggle,
}: DashboardSidebarProps) => {
  return (
    <aside
      className={
        collapsed
          ? "dashboardSidebar dashboardSidebar--collapsed"
          : "dashboardSidebar"
      }
    >
      <button
        type="button"
        className="dashboardSidebar__toggle"
        onClick={onToggle}
        aria-label={
          collapsed
            ? "Expand sidebar"
            : "Collapse sidebar"
        }
        title={
          collapsed
            ? "Expand sidebar"
            : "Collapse sidebar"
        }
      >
        {collapsed ? (
          <ChevronRight aria-hidden="true" />
        ) : (
          <ChevronLeft aria-hidden="true" />
        )}
      </button>

      <nav
        className="dashboardSidebar__nav"
        aria-label="Dashboard navigation"
      >
        <span className="dashboardSidebar__title">
          Workspace
        </span>

        <NavLink
          to="/dashboard"
          end
          className={navLinkClass}
          title="Overview"
        >
          <LayoutDashboard aria-hidden="true" />
          <span>Overview</span>
        </NavLink>

        <NavLink
          to="/dashboard/tasks"
          className={navLinkClass}
          title="Tasks"
        >
          <CheckSquare aria-hidden="true" />
          <span>Tasks</span>
        </NavLink>

        <NavLink
          to="/dashboard/calendar"
          className={navLinkClass}
          title="Calendar"
        >
          <CalendarDays aria-hidden="true" />
          <span>Calendar</span>
        </NavLink>

        <div className="dashboardSidebar__divider" />

        <span className="dashboardSidebar__title">
          Projects
        </span>

        <NavLink
          to="/dashboard/projects"
          className={navLinkClass}
          title="Projects"
        >
          <FolderKanban aria-hidden="true" />
          <span>Projects</span>
        </NavLink>

        <NavLink
          to="/dashboard/analytics"
          className={navLinkClass}
          title="Analytics"
        >
          <BarChart3 aria-hidden="true" />
          <span>Analytics</span>
        </NavLink>

        <div className="dashboardSidebar__divider" />

        <span className="dashboardSidebar__title">
          Account
        </span>

        <NavLink
          to="/profile"
          className={navLinkClass}
          title="Profile"
        >
          <User aria-hidden="true" />
          <span>Profile</span>
        </NavLink>

        <NavLink
          to="/settings"
          className={navLinkClass}
          title="Preferences"
        >
          <Settings aria-hidden="true" />
          <span>Preferences</span>
        </NavLink>
      </nav>
    </aside>
  );
};

export default DashboardSidebar;