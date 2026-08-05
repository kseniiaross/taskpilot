import {
  useContext,
  useMemo,
  useState,
} from "react";

import {
  closestCenter,
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";

import {
  arrayMove,
} from "@dnd-kit/sortable";

import {
  TaskContext,
  type Task,
  type TaskCategory,
} from "../context/TaskContext";

import {
  useAuth,
} from "../context/AuthContext";

import DashboardStats from "../components/dashboard/Stats";

import TaskToolbar, {
  type TaskFilter,
  type TaskSort,
} from "../components/dashboard/tasks/TaskToolbar";

import TaskGrid from "../components/dashboard/tasks/TaskGrid";
import TaskModal from "../components/dashboard/tasks/TaskModal";

import { parseDueDate } from "../utils/dates";

const PRIORITY_ORDER={
  high:3,
  medium:2,
  low:1,
} as const;

const Overview=()=>{

  const context=
    useContext(TaskContext);

  const {
    user,
  }=useAuth();

  const[
    isModalOpen,
    setIsModalOpen,
  ]=useState(false);

  const[
    editingTask,
    setEditingTask,
  ]=useState<Task|null>(
    null,
  );

  const[
    searchQuery,
    setSearchQuery,
  ]=useState("");

  const[
    filter,
    setFilter,
  ]=useState<TaskFilter>(
    "all",
  );

  const[
    sort,
    setSort,
  ]=useState<TaskSort>(
    "newest",
  );

  const sensors=
    useSensors(
      useSensor(
        PointerSensor,
        {
          activationConstraint:{
            distance:8,
          },
        },
      ),
    );

  const tasks=
    useMemo(
      ()=>context?.state.tasks??[],
      [context],
    );

  const completedTasks=
    useMemo(
      ()=>context?.state.completedTasks??[],
      [context],
    );

  const activeWorkspaceId=
    user?.activeWorkspaceId;

  const allTasks=
    useMemo(
      ()=>[
        ...tasks,
        ...completedTasks,
      ].filter(
        (task)=>
          task.workspaceId===
          activeWorkspaceId,
      ),
      [
        tasks,
        completedTasks,
        activeWorkspaceId,
      ],
    );

  const filteredTasks=
    useMemo(
      ()=>{

        const normalizedQuery=
          searchQuery
            .trim()
            .toLowerCase();

        return allTasks.filter(
          (task)=>{

            const title=
              task.title
                .trim()
                .toLowerCase();

            const description=
              task.description
                ?.trim()
                .toLowerCase()??"";

            const matchesSearch=
              normalizedQuery.length===0||
              title.includes(
                normalizedQuery,
              )||
              description.includes(
                normalizedQuery,
              );

            const matchesFilter=
              filter==="all"||
              (
                filter==="active"&&
                !task.completed
              )||
              (
                filter==="completed"&&
                task.completed
              );

            return(
              matchesSearch&&
              matchesFilter
            );
          },
        );
      },
      [
        allTasks,
        filter,
        searchQuery,
      ],
    );

  const sortedTasks=
    useMemo(
      ()=>{

        const taskList=[
          ...filteredTasks,
        ];

        switch(sort){

          case "oldest":
            return taskList.sort(
              (
                firstTask,
                secondTask,
              )=>
                firstTask.order-
                secondTask.order,
            );

          case "alphabetical":
            return taskList.sort(
              (
                firstTask,
                secondTask,
              )=>
                firstTask.title.localeCompare(
                  secondTask.title,
                ),
            );

          case "dueDate":
            return taskList.sort(
              (
                firstTask,
                secondTask,
              )=>{

                const firstDate=
                  parseDueDate(
                    firstTask.dueDate,
                  );

                const secondDate=
                  parseDueDate(
                    secondTask.dueDate,
                  );

                const safeFirstDate=
                  Number.isNaN(firstDate)
                    ?Number.MAX_SAFE_INTEGER
                    :firstDate;

                const safeSecondDate=
                  Number.isNaN(secondDate)
                    ?Number.MAX_SAFE_INTEGER
                    :secondDate;

                return(
                  safeFirstDate-
                  safeSecondDate
                );
              },
            );

          case "priority":
            return taskList.sort(
              (
                firstTask,
                secondTask,
              )=>
                PRIORITY_ORDER[
                  secondTask.priority
                ]-
                PRIORITY_ORDER[
                  firstTask.priority
                ],
            );

          case "newest":
          default:
            return taskList.sort(
              (
                firstTask,
                secondTask,
              )=>
                secondTask.order-
                firstTask.order,
            );
        }

      },
      [
        filteredTasks,
        sort,
      ],
    );
      const activeCount=
    useMemo(
      ()=>allTasks.filter(
        (task)=>
          !task.completed,
      ).length,
      [allTasks],
    );

  const completedCount=
    useMemo(
      ()=>allTasks.filter(
        (task)=>
          task.completed,
      ).length,
      [allTasks],
    );

  const activeWorkspace=
    user?.workspaces.find(
      (workspace)=>
        workspace.id===
        activeWorkspaceId,
    );

  const currentHour=
    new Date().getHours();

  const greeting=
    currentHour<12
      ?"Good Morning"
      :currentHour<18
        ?"Good Afternoon"
        :"Good Evening";

  const greetingMessage=
    currentHour<12
      ?"Start your day with a clear plan and focus on what matters most."
      :currentHour<18
        ?"Keep your momentum going and stay on top of your priorities."
        :"Wrap up today's work and prepare for a productive tomorrow.";

  const firstName=
    user?.fullName
      ?.trim()
      .split(/\s+/)[0];

  if(!context){
    return(
      <div
        className="dashboardState"
        aria-live="polite"
      >
        <div
          className="dashboardState__spinner"
          aria-hidden="true"
        />

        <p>
          Loading your workspace...
        </p>
      </div>
    );
  }

  const{
    dispatch,
  }=context;

  /* =========================================================================
     HANDLERS
     ========================================================================= */

  const openCreateModal=()=>{

    setEditingTask(null);
    setIsModalOpen(true);

  };

  const closeTaskModal=()=>{

    setEditingTask(null);
    setIsModalOpen(false);

  };

  const handleEditTask=(
    task:Task,
  )=>{

    setEditingTask(task);
    setIsModalOpen(true);

  };

  const handleSubmitTask=(
    title:string,
    description:string,
    dueDate:string,
    dueTime:string,
    timeZone:string,
    priority:
      |"low"
      |"medium"
      |"high",
    category:TaskCategory,
    projectId:string,
  )=>{

    if(!user){
      return;
    }

    if(editingTask){

      dispatch({
        type:"EDIT_TASK",
        task:{
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

    }else{

      dispatch({
        type:"ADD_TASK",
        task:{
          id:crypto.randomUUID(),
          workspaceId:user.activeWorkspaceId,
          projectId,
          title,
          description,
          dueDate,
          dueTime,
          timeZone,
          priority,
          category,
          completed:false,
        },
      });

    }

    closeTaskModal();

  };

  const handleCompleteTask=(
    id:string,
  )=>{

    dispatch({
      type:"COMPLETE_TASK",
      id,
    });

  };

  const handleDeleteTask=(
    id:string,
  )=>{

    dispatch({
      type:"DELETE_TASK",
      id,
    });

  };

  const handleDragEnd=(
    event:DragEndEvent,
  )=>{

    if(sort!=="newest"){
      return;
    }

    const{
      active,
      over,
    }=event;

    if(
      !over||
      active.id===over.id
    ){
      return;
    }

    const activeTask=
      allTasks.find(
        (task)=>
          task.id===active.id,
      );

    const overTask=
      allTasks.find(
        (task)=>
          task.id===over.id,
      );

    if(
      !activeTask||
      !overTask||
      activeTask.completed!==
        overTask.completed
    ){
      return;
    }

    const sourceList=
      activeTask.completed
        ?completedTasks
        :tasks;

    const oldIndex=
      sourceList.findIndex(
        (task)=>
          task.id===
          activeTask.id,
      );

    const newIndex=
      sourceList.findIndex(
        (task)=>
          task.id===
          overTask.id,
      );

    if(
      oldIndex<0||
      newIndex<0
    ){
      return;
    }

    dispatch({
      type:"REORDER_TASKS",
      scope:
        activeTask.completed
          ?"completed"
          :"active",
      reorderedList:
        arrayMove(
          sourceList,
          oldIndex,
          newIndex,
        ),
    });

  };

  return(
    <section className="dashboardOverview">
      <section className="dashboardOverview__welcome">
        <div>
          <span className="dashboardOverview__eyebrow">
            {activeWorkspace?.name??"Personal Workspace"}
          </span>

          <h1>
            {firstName
              ?`${greeting}, ${firstName}`
              :greeting}
          </h1>

          <p>
            {greetingMessage}
          </p>
        </div>

        <button
          type="button"
          className="dashboardOverview__primaryButton"
          onClick={openCreateModal}
        >
          <span aria-hidden="true">
            ＋
          </span>

          <span>
            New Task
          </span>
        </button>
      </section>

      <DashboardStats
        activeCount={activeCount}
        completedCount={completedCount}
        tasks={allTasks}
      />

      <section className="dashboardOverview__workspace">
        <TaskToolbar
          searchQuery={searchQuery}
          filter={filter}
          sort={sort}
          resultCount={sortedTasks.length}
          onSearchChange={setSearchQuery}
          onFilterChange={setFilter}
          onSortChange={setSort}
          onCreateTask={openCreateModal}
        />

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <TaskGrid
            tasks={sortedTasks}
            hasAnyTasks={allTasks.length>0}
            hideDrag={sort!=="newest"}
            onComplete={handleCompleteTask}
            onDelete={handleDeleteTask}
            onEdit={handleEditTask}
            onCreateTask={openCreateModal}
          />
        </DndContext>
      </section>

      {isModalOpen&&(
        <TaskModal
          task={editingTask}
          onClose={closeTaskModal}
          onSubmit={handleSubmitTask}
        />
      )}
    </section>
  );
};

export default Overview;