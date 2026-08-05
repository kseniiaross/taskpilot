import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import type {
  ReactNode,
} from "react";

import {
  AuthProvider,
} from "./context/AuthContext";

import {
  ProjectProvider,
} from "./context/ProjectContext";

import {
  TaskProvider,
} from "./context/TaskContext";

import DashboardLayout from "./components/dashboard/layout/Layout";
import Footer from "./components/dashboard/layout/Footer";

import DashboardAnalytics from "./pages/dashboard/analytics/Analytics";
import DashboardCalendar from "./pages/dashboard/calendar/Calendar";
import DashboardProjectDetails from "./pages/dashboard/projects/ProjectDetails";
import DashboardProjects from "./pages/dashboard/projects/Projects";
import DashboardTasks from "./pages/dashboard/tasks/Tasks";

import DashboardOverview from "./pages/Overview";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import ProtectedRoute from "./pages/ProtectedRoute";
import RegisterStepOne from "./pages/RegisterStepOne";
import RegisterStepTwo from "./pages/RegisterStepTwo";
import ResetPassword from "./pages/ResetPassword";
import Settings from "./pages/Settings";

import "./styles/index.css";

type PublicPageProps={
  children:ReactNode;
};

const PublicPage=({
  children,
}:PublicPageProps)=>(
  <>
    {children}
    <Footer/>
  </>
);

const App=()=>{
  return(
    <AuthProvider>
      <ProjectProvider>
        <TaskProvider>
          <BrowserRouter>
            <Routes>
              <Route
                path="/"
                element={
                  <PublicPage>
                    <Home/>
                  </PublicPage>
                }
              />
              <Route
                path="/login"
                element={
                  <PublicPage>
                    <Login/>
                  </PublicPage>
                }
              />
              <Route
                path="/register"
                element={
                  <PublicPage>
                    <RegisterStepOne/>
                  </PublicPage>
                }
              />
              <Route
                path="/register/details"
                element={
                  <PublicPage>
                    <RegisterStepTwo/>
                  </PublicPage>
                }
              />
              <Route
                path="/reset-password"
                element={
                  <PublicPage>
                    <ResetPassword/>
                  </PublicPage>
                }
              />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <DashboardLayout/>
                  </ProtectedRoute>
                }
              >
                <Route
                  index
                  element={
                    <DashboardOverview/>
                  }
                />
                <Route
                  path="tasks"
                  element={
                    <DashboardTasks/>
                  }
                />
                <Route
                  path="calendar"
                  element={
                    <DashboardCalendar/>
                  }
                />
                <Route
                  path="projects"
                  element={
                    <DashboardProjects/>
                  }
                />
                <Route
                  path="projects/:projectId"
                  element={
                    <DashboardProjectDetails/>
                  }
                />
                <Route
                  path="analytics"
                  element={
                    <DashboardAnalytics/>
                  }
                />
              </Route>
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile/>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/settings"
                element={
                  <ProtectedRoute>
                    <Settings/>
                  </ProtectedRoute>
                }
              />
              <Route
                path="*"
                element={
                  <Navigate
                    to="/"
                    replace
                  />
                }
              />
            </Routes>
          </BrowserRouter>
        </TaskProvider>
      </ProjectProvider>
    </AuthProvider>
  );
};

export default App;