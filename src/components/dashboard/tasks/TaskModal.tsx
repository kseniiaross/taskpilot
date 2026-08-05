import{
  type FormEvent,
  useRef,
  useState,
}from"react";

import type{
  Task,
  TaskCategory,
}from"../../../context/TaskContext";

import{
  useProjects,
}from"../../../context/ProjectContext";

import { useModal } from "../../../hooks/useModal";

type TaskPriority=
  Task["priority"];

interface TaskModalProps{
  task:Task|null;
  defaultProjectId?:string;
  hideProjectSelect?:boolean;
  onClose:()=>void;
  onSubmit:(
    title:string,
    description:string,
    dueDate:string,
    dueTime:string,
    timeZone:string,
    priority:TaskPriority,
    category:TaskCategory,
    projectId:string,
  )=>void;
}

interface SelectOption<T extends string>{
  value:T;
  label:string;
}

const DEFAULT_TIME_ZONE=
  Intl.DateTimeFormat().resolvedOptions().timeZone;

const PRIORITY_OPTIONS:SelectOption<TaskPriority>[]=[
  {
    value:"low",
    label:"Low",
  },
  {
    value:"medium",
    label:"Medium",
  },
  {
    value:"high",
    label:"High",
  },
];

const CATEGORY_OPTIONS:SelectOption<TaskCategory>[]=[
  {
    value:"project",
    label:"Project",
  },
  {
    value:"work",
    label:"Work",
  },
  {
    value:"meeting",
    label:"Meeting",
  },
  {
    value:"study",
    label:"Study",
  },
  {
    value:"personal",
    label:"Personal",
  },
  {
    value:"shopping",
    label:"Shopping",
  },
  {
    value:"health",
    label:"Health",
  },
];

const TIME_ZONE_OPTIONS:SelectOption<string>[]=[
  {
    value:"America/New_York",
    label:"Eastern Time (ET)",
  },
  {
    value:"America/Chicago",
    label:"Central Time (CT)",
  },
  {
    value:"America/Denver",
    label:"Mountain Time (MT)",
  },
  {
    value:"America/Los_Angeles",
    label:"Pacific Time (PT)",
  },
  {
    value:"UTC",
    label:"UTC",
  },
];

const TaskModal=({
  task,
  defaultProjectId,
  hideProjectSelect=false,
  onClose,
  onSubmit,
}:TaskModalProps)=>{

  const{
    projects,
  }=useProjects();

  const titleInputRef=
    useRef<HTMLInputElement>(null);

  const[
    title,
    setTitle,
  ]=useState(
    task?.title??"",
  );

  const[
    description,
    setDescription,
  ]=useState(
    task?.description??"",
  );

  const[
    dueDate,
    setDueDate,
  ]=useState(
    task?.dueDate??"",
  );

  const[
    dueTime,
    setDueTime,
  ]=useState(
    task?.dueTime??"",
  );

  const[
    timeZone,
    setTimeZone,
  ]=useState(
    task?.timeZone??
    DEFAULT_TIME_ZONE,
  );

  const[
    priority,
    setPriority,
  ]=useState<TaskPriority>(
    task?.priority??"medium",
  );

  const[
    category,
    setCategory,
  ]=useState<TaskCategory>(
    task?.category??"project",
  );

  const[
    projectId,
    setProjectId,
  ]=useState(
    task?.projectId??
    defaultProjectId??
    "",
  );

  const isEditing=
    task!==null;

  const normalizedTitle=
    title.trim();

  const normalizedDescription=
    description.trim();

  const isSubmitDisabled=
    normalizedTitle.length===0||
    dueDate.length===0;

  /* =========================================================================
     MODAL BEHAVIOR (Escape, focus, scroll-lock, overlay click)
     ========================================================================= */

  const { handleOverlayMouseDown }=
    useModal({
      onClose,
      focusRef:titleInputRef,
    });

  /* =========================================================================
     HANDLERS
     ========================================================================= */

  const handleSubmit=(
    event:FormEvent<HTMLFormElement>,
  )=>{

    event.preventDefault();

    if(isSubmitDisabled){
      return;
    }

    onSubmit(
      normalizedTitle,
      normalizedDescription,
      dueDate,
      dueTime,
      timeZone,
      priority,
      category,
      projectId,
    );

  };

  return(
    <div
      className="taskModalOverlay"
      role="presentation"
      onMouseDown={handleOverlayMouseDown}
    >
      <section
        className="taskModal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="task-modal-title"
        aria-describedby="task-modal-description"
      >
        <header className="taskModal__header">
          <div className="taskModal__heading">
            <span className="taskModal__eyebrow">
              TaskPilot Workspace
            </span>

            <h2 id="task-modal-title">
              {isEditing
                ?"Edit Task"
                :"Create New Task"}
            </h2>

            <p id="task-modal-description">
              {isEditing
                ?"Update your task details and save your changes."
                :"Add a title, description, project, category, priority, due date and time."}
            </p>
          </div>

          <button
            type="button"
            className="taskModal__close"
            aria-label="Close task modal"
            onClick={onClose}
          >
            <span aria-hidden="true">
              ×
            </span>
          </button>
        </header>

        <form
          className="taskModal__form"
          onSubmit={handleSubmit}
        >

          <label className="taskModalField">
            <span>
              Task Title
              <strong aria-hidden="true">
                *
              </strong>
            </span>

            <input
              ref={titleInputRef}
              type="text"
              value={title}
              required
              maxLength={80}
              autoComplete="off"
              placeholder="Finish portfolio project"
              onChange={(event)=>
                setTitle(
                  event.target.value,
                )
              }
            />

            <small>
              {title.length}/80
            </small>
          </label>

          <label className="taskModalField">
            <span>
              Description
            </span>

            <textarea
              rows={5}
              value={description}
              maxLength={300}
              placeholder="Describe your task..."
              onChange={(event)=>
                setDescription(
                  event.target.value,
                )
              }
            />

            <small>
              {description.length}/300
            </small>
          </label>
                        {!hideProjectSelect&&(
            <label className="taskModalField">
              <span>
                Project
              </span>

              <select
                value={projectId}
                onChange={(event)=>
                  setProjectId(
                    event.target.value,
                  )
                }
              >
                <option value="">
                  No project
                </option>

                {projects.map((project)=>(
                  <option
                    key={project.id}
                    value={project.id}
                  >
                    {project.name}
                  </option>
                ))}
              </select>
            </label>
          )}

          <div className="taskModalGrid">
            <label className="taskModalField">
              <span>
                Priority
              </span>

              <select
                value={priority}
                onChange={(event)=>
                  setPriority(
                    event.target.value as TaskPriority,
                  )
                }
              >
                {PRIORITY_OPTIONS.map(({
                  value,
                  label,
                })=>(
                  <option
                    key={value}
                    value={value}
                  >
                    {label}
                  </option>
                ))}
              </select>
            </label>

            <label className="taskModalField">
              <span>
                Category
              </span>

              <select
                value={category}
                onChange={(event)=>
                  setCategory(
                    event.target.value as TaskCategory,
                  )
                }
              >
                {CATEGORY_OPTIONS.map(({
                  value,
                  label,
                })=>(
                  <option
                    key={value}
                    value={value}
                  >
                    {label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="taskModalGrid">
            <label className="taskModalField">
              <span>
                Due Date
                <strong aria-hidden="true">
                  *
                </strong>
              </span>

              <input
                type="date"
                value={dueDate}
                required
                onChange={(event)=>
                  setDueDate(
                    event.target.value,
                  )
                }
              />
            </label>

            <label className="taskModalField">
              <span>
                Due Time
              </span>

              <input
                type="time"
                value={dueTime}
                onChange={(event)=>
                  setDueTime(
                    event.target.value,
                  )
                }
              />
            </label>
          </div>

          <label className="taskModalField">
            <span>
              Time Zone
            </span>

            <select
              value={timeZone}
              onChange={(event)=>
                setTimeZone(
                  event.target.value,
                )
              }
            >
              {!TIME_ZONE_OPTIONS.some(
                ({value})=>
                  value===timeZone,
              )&&(
                <option value={timeZone}>
                  {timeZone}
                </option>
              )}

              {TIME_ZONE_OPTIONS.map(({
                value,
                label,
              })=>(
                <option
                  key={value}
                  value={value}
                >
                  {label}
                </option>
              ))}
            </select>
          </label>

          <footer className="taskModal__actions">
            <button
              type="button"
              className="taskModal__cancel"
              onClick={onClose}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="taskModal__submit"
              disabled={isSubmitDisabled}
            >
              {isEditing
                ?"Save Changes"
                :"Create Task"}
            </button>
          </footer>
        </form>
      </section>
    </div>
  );
};

export default TaskModal;