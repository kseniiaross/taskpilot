export type TaskFilter =
  | "all"
  | "active"
  | "completed";

export type TaskSort =
  | "newest"
  | "oldest"
  | "dueDate"
  | "priority"
  | "alphabetical";

interface TaskToolbarProps {
  searchQuery:string;
  filter:TaskFilter;
  sort:TaskSort;
  resultCount:number;
  onSearchChange:(value:string)=>void;
  onFilterChange:(filter:TaskFilter)=>void;
  onSortChange:(sort:TaskSort)=>void;
  onCreateTask:()=>void;
}

const filters=[
  {
    value:"all",
    label:"All",
  },
  {
    value:"active",
    label:"Active",
  },
  {
    value:"completed",
    label:"Completed",
  },
] as const;

const sortOptions=[
  {
    value:"newest",
    label:"Newest",
  },
  {
    value:"oldest",
    label:"Oldest",
  },
  {
    value:"dueDate",
    label:"Due Date",
  },
  {
    value:"priority",
    label:"Priority",
  },
  {
    value:"alphabetical",
    label:"A → Z",
  },
] as const;

const TaskToolbar=({
  searchQuery,
  filter,
  sort,
  resultCount,
  onSearchChange,
  onFilterChange,
  onSortChange,
  onCreateTask,
}:TaskToolbarProps)=>{

  return(
    <header className="dashboardToolbar">
      <div className="dashboardToolbar__search">
        <label className="dashboardSearch" htmlFor="task-search">
          <span className="visually-hidden">Search tasks</span>
          <input
            id="task-search"
            type="search"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(event)=>
              onSearchChange(event.target.value)
            }
          />
        </label>

        <span className="dashboardToolbar__resultCount" aria-live="polite">
          {resultCount} {resultCount===1?"task":"tasks"}
        </span>
      </div>

      <div
        className="dashboardFilters"
        role="group"
        aria-label="Task filters"
      >
        {filters.map(
          ({
            value,
            label,
          })=>(
            <button
              key={value}
              type="button"
              className={
                filter===value
                  ? "dashboardFilter dashboardFilter--active"
                  : "dashboardFilter"
              }
              onClick={()=>
                onFilterChange(value)
              }
            >
              {label}
            </button>
          ),
        )}
      </div>

      <div className="dashboardToolbar__sort">
        <span>
          Sort tasks
        </span>

        <select
          className="dashboardSort"
          value={sort}
          onChange={(event)=>
            onSortChange(
              event.target.value as TaskSort,
            )
          }
        >
          {sortOptions.map(
            ({
              value,
              label,
            })=>(
              <option
                key={value}
                value={value}
              >
                {label}
              </option>
            ),
          )}
        </select>
      </div>

      <button
        type="button"
        className="dashboardToolbar__create"
        onClick={onCreateTask}
        aria-label="Create task"
      >
        +
      </button>

    </header>
  );
};

export default TaskToolbar;