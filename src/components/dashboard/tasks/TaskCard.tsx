import type{CSSProperties}from"react";
import{useSortable}from"@dnd-kit/sortable";
import{CSS}from"@dnd-kit/utilities";
import type{Task}from"../../../context/TaskContext";

import { formatDueDate, getTodayInTimeZone } from "../../../utils/dates";

interface TaskCardProps{
  task:Task;
  onComplete:(id:string)=>void;
  onDelete:(id:string)=>void;
  onEdit:(task:Task)=>void;
  compact?:boolean;
  hideDrag?:boolean;
  hideDelete?:boolean;
  projectLabel?:string;
}

type DueVariant="neutral"|"warning"|"danger";

interface DueInfo{
  label:string;
  variant:DueVariant;
}

const CATEGORY_LABELS:Record<Task["category"],string>={
  project:"Project",
  meeting:"Meeting",
  work:"Work",
  study:"Study",
  personal:"Personal",
  shopping:"Shopping",
  health:"Health",
};

const PRIORITY_CLASSES:Record<Task["priority"],string>={
  low:"taskCard__priority taskCard__priority--low",
  medium:"taskCard__priority taskCard__priority--medium",
  high:"taskCard__priority taskCard__priority--high",
};

const DEFAULT_TIME_ZONE=
  Intl.DateTimeFormat().resolvedOptions().timeZone;

/*
  Returns null for completed tasks — there is already a "Completed"
  status badge, and a due-date badge that only ever says "Completed"
  again was pure duplication with no extra information.
*/
const getDueInfo=(task:Task):DueInfo|null=>{
  if(task.completed){
    return null;
  }
  if(!task.dueDate){
    return{
      label:"No deadline",
      variant:"neutral",
    };
  }

  const today=
    getTodayInTimeZone(
      task.timeZone||DEFAULT_TIME_ZONE,
    );

  if(task.dueDate<today){
    return{
      label:"Overdue",
      variant:"danger",
    };
  }
  if(task.dueDate===today){
    return{
      label:"Due today",
      variant:"warning",
    };
  }
  return{
    label:`Due ${formatDueDate(task.dueDate)}`,
    variant:"neutral",
  };
};

const TaskCard=({
  task,
  onComplete,
  onDelete,
  onEdit,
  compact=false,
  hideDrag=false,
  hideDelete=false,
  projectLabel="Workspace",
}:TaskCardProps)=>{

  const{
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  }=useSortable({
    id:task.id,
    disabled:hideDrag,
  });

  const dueInfo=
    getDueInfo(task);

  const style:CSSProperties={
    transform:
      CSS.Transform.toString(
        transform,
      ),
    transition,
  };

  const className=[
    "taskCard",
    compact&&
      "taskCard--compact",
    task.completed&&
      "taskCard--completed",
    isDragging&&
      "taskCard--dragging",
  ]
    .filter(Boolean)
    .join(" ");

  const statusClassName=
    task.completed
      ?"taskCard__status taskCard__status--completed"
      :"taskCard__status taskCard__status--active";

  return(
    <article
      ref={setNodeRef}
      className={className}
      style={style}
    >
      <header className="taskCard__header">
        <div className="taskCard__statusGroup">
          <span className={statusClassName}>
            {task.completed
              ?"Completed"
              :"Active"}
          </span>

          <span
            className={`taskCard__category taskCard__category--${task.category}`}
          >
            {
              CATEGORY_LABELS[
                task.category
              ]
            }
          </span>

          <span
            className={
              PRIORITY_CLASSES[
                task.priority
              ]
            }
          >
            {task.priority}
          </span>

          {dueInfo&&(
            <span
              className={`taskCard__due taskCard__due--${dueInfo.variant}`}
            >
              {dueInfo.label}
            </span>
          )}
        </div>

        <div className="taskCard__headerRight">
          <span className="taskCard__date">
            {formatDueDate(task.dueDate)}
            {task.dueTime&&(
              <span className="taskCard__time">
                {task.dueTime}
              </span>
            )}
          </span>

          {!hideDrag&&(
            <button
              type="button"
              className="taskCard__drag"
              aria-label={`Reorder ${task.title}`}
              title="Drag to reorder"
              {...attributes}
              {...listeners}
            >
              <span aria-hidden="true">
                ⋮⋮
              </span>
            </button>
          )}
        </div>
      </header>

      <div className="taskCard__content">
        <h3>
          {task.title}
        </h3>

        <p>
          {
            task.description||
            "No description was added for this task."
          }
        </p>
      </div>

      <div className="taskCard__meta">
        <span className="taskCard__project">
          {projectLabel}
        </span>
      </div>
              <footer className={`taskCard__footer${compact?" taskCard__footer--compact":""}`}>
        <div className="taskCard__actions">
          {task.completed?(
            <span className="taskCard__completedMessage">
              ✓ Task Completed
            </span>
          ):(
            <>
              <button
                type="button"
                className="taskCard__edit"
                onClick={()=>
                  onEdit(task)
                }
              >
                Edit
              </button>

              <button
                type="button"
                className="taskCard__complete"
                onClick={()=>
                  onComplete(task.id)
                }
              >
                Complete
              </button>
            </>
          )}
        </div>

        {!hideDelete&&(
          <button
            type="button"
            className="taskCard__delete"
            onClick={()=>
              onDelete(task.id)
            }
          >
            Delete
          </button>
        )}
      </footer>
    </article>
  );
};

export default TaskCard;