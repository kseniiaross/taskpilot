import {
  useContext,
  useState,
} from "react";

import {
  TaskContext,
  type Task,
  type TaskCategory,
} from "../../../context/TaskContext";

import {
  useAuth,
} from "../../../context/AuthContext";

import TaskGrid from "../../../components/dashboard/tasks/TaskGrid";
import TaskModal from "../../../components/dashboard/tasks/TaskModal";

const DashboardTasks = () => {
  const context =
    useContext(TaskContext);

  const {
    user,
  } = useAuth();

  const [
    isModalOpen,
    setIsModalOpen,
  ] = useState(false);

  const [
    editingTask,
    setEditingTask,
  ] = useState<Task | null>(null);

  const activeTasks =
    context?.state.tasks.filter(
      (task) =>
        task.workspaceId ===
          user?.activeWorkspaceId &&
        !task.completed,
    ) ?? [];

  const openCreateModal = () => {
    setEditingTask(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setEditingTask(null);
    setIsModalOpen(false);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleCompleteTask = (id: string) => {
    if (!context) {
      return;
    }

    context.dispatch({
      type: "COMPLETE_TASK",
      id,
    });
  };

  const handleDeleteTask = (id: string) => {
    if (!context) {
      return;
    }

    context.dispatch({
      type: "DELETE_TASK",
      id,
    });
  };

  const handleSubmitTask = (
    title: string,
    description: string,
    dueDate: string,
    dueTime: string,
    timeZone: string,
    priority: Task["priority"],
    category: TaskCategory,
    projectId: string,
  ) => {
    if (!context || !user) {
      return;
    }

    if (editingTask) {
      context.dispatch({
        type: "EDIT_TASK",
        task: {
          ...editingTask,
          title,
          description,
          dueDate,
          dueTime,
          timeZone,
          priority,
          category,
          projectId,
        },
      });
    } else {
      context.dispatch({
        type: "ADD_TASK",
        task: {
          id: crypto.randomUUID(),
          workspaceId: user.activeWorkspaceId,
          projectId,
          title,
          description,
          dueDate,
          dueTime,
          timeZone,
          priority,
          category,
          completed: false,
        },
      });
    }

    closeModal();
  };

  return (
    <section className="dashboardTasks">
      <header className="dashboardTasks__header">
        <div>
          <span className="dashboardTasks__eyebrow">
            Task management
          </span>

          <h1>Tasks</h1>

          <p>
            Review and manage all active tasks
            in your current workspace.
          </p>
        </div>

        <div className="dashboardTasks__headerActions">
          <span className="dashboardTasks__count">
            {activeTasks.length} active
          </span>

          <button
            type="button"
            className="dashboardTasks__createButton"
            onClick={openCreateModal}
          >
            <span aria-hidden="true">＋</span>
            <span>New Task</span>
          </button>
        </div>
      </header>

      <div className="dashboardTasks__card">
        <TaskGrid
          tasks={activeTasks}
          hasAnyTasks={activeTasks.length > 0}
          hideDrag
          onComplete={handleCompleteTask}
          onDelete={handleDeleteTask}
          onEdit={handleEditTask}
          onCreateTask={openCreateModal}
        />
      </div>

      {isModalOpen && (
        <TaskModal
          task={editingTask}
          onClose={closeModal}
          onSubmit={handleSubmitTask}
        />
      )}
    </section>
  );
};

export default DashboardTasks;