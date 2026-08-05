import {
  useContext,
} from "react";

import {
  TaskContext,
  type TaskCategory,
} from "../../../context/TaskContext";

import {
  useAuth,
} from "../../../context/AuthContext";

/* =========================================================================
   PROGRESS RING

   A small reusable SVG donut, sized to match the card layout. `percent`
   drives how much of the circle's circumference is drawn as the
   colored arc — the rest stays as a faint track color.
   ========================================================================= */

interface ProgressRingProps{
  percent:number;
  color:string;
  trackColor?:string;
  size?:number;
  strokeWidth?:number;
}

const ProgressRing=({
  percent,
  color,
  trackColor="#eef0f6",
  size=88,
  strokeWidth=10,
}:ProgressRingProps)=>{

  const radius=
    (size-strokeWidth)/2;

  const circumference=
    2*Math.PI*radius;

  const clampedPercent=
    Math.min(
      100,
      Math.max(0,percent),
    );

  const dashOffset=
    circumference-
    (clampedPercent/100)*
    circumference;

  return(
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className="analyticsRing"
      role="img"
      aria-label={`${clampedPercent}%`}
    >
      <circle
        cx={size/2}
        cy={size/2}
        r={radius}
        fill="none"
        stroke={trackColor}
        strokeWidth={strokeWidth}
      />

      <circle
        cx={size/2}
        cy={size/2}
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={dashOffset}
        transform={`rotate(-90 ${size/2} ${size/2})`}
        className="analyticsRing__arc"
      />

      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="central"
        className="analyticsRing__label"
      >
        {clampedPercent}%
      </text>
    </svg>
  );
};

/* =========================================================================
   BREAKDOWN BAR

   A single labeled horizontal bar used for the category/priority
   breakdown lists — shows a count, a label, and a proportional fill
   relative to the largest value in its group.
   ========================================================================= */

interface BreakdownBarProps{
  label:string;
  count:number;
  maxCount:number;
  color:string;
}

const BreakdownBar=({
  label,
  count,
  maxCount,
  color,
}:BreakdownBarProps)=>{

  const widthPercent=
    maxCount>0
      ?Math.round((count/maxCount)*100)
      :0;

  return(
    <div className="analyticsBreakdown__row">
      <span className="analyticsBreakdown__label">
        {label}
      </span>

      <div className="analyticsBreakdown__track">
        <div
          className="analyticsBreakdown__fill"
          style={{
            width:`${widthPercent}%`,
            background:color,
          }}
        />
      </div>

      <span className="analyticsBreakdown__count">
        {count}
      </span>
    </div>
  );
};

const CATEGORY_LABELS:Record<TaskCategory,string>={
  project:"Project",
  meeting:"Meeting",
  work:"Work",
  study:"Study",
  personal:"Personal",
  shopping:"Shopping",
  health:"Health",
};

const CATEGORY_COLORS:Record<TaskCategory,string>={
  project:"#4f46e5",
  meeting:"#b45309",
  work:"#2563eb",
  study:"#16a34a",
  personal:"#db2777",
  shopping:"#ea580c",
  health:"#15803d",
};

const PRIORITY_LABELS={
  high:"High",
  medium:"Medium",
  low:"Low",
} as const;

const PRIORITY_COLORS={
  high:"#dc2626",
  medium:"#d97706",
  low:"#16a34a",
} as const;

const DashboardAnalytics = () => {
  const context =
    useContext(TaskContext);

  const {
    user,
  } = useAuth();

  const tasks = [
    ...(context?.state.tasks ?? []),
    ...(context?.state.completedTasks ??
      []),
  ].filter(
    (task) =>
      task.workspaceId ===
      user?.activeWorkspaceId,
  );

  const completed =
    tasks.filter(
      (task) => task.completed,
    ).length;

  const active =
    tasks.filter(
      (task) => !task.completed,
    ).length;

  const completionRate =
    tasks.length > 0
      ? Math.round(
          (completed /
            tasks.length) *
            100,
        )
      : 0;

  const activeRate=
    tasks.length>0
      ?Math.round((active/tasks.length)*100)
      :0;

  const categoryCounts=
    Object.keys(CATEGORY_LABELS).reduce(
      (acc,category)=>{
        acc[category as TaskCategory]=
          tasks.filter(
            (task)=>task.category===category,
          ).length;
        return acc;
      },
      {} as Record<TaskCategory,number>,
    );

  const categoryEntries=
    (Object.keys(categoryCounts) as TaskCategory[])
      .map((category)=>({
        category,
        count:categoryCounts[category],
      }))
      .filter(({count})=>count>0)
      .sort((a,b)=>b.count-a.count);

  const maxCategoryCount=
    categoryEntries.length>0
      ?categoryEntries[0].count
      :0;

  const priorityCounts={
    high:tasks.filter((task)=>task.priority==="high").length,
    medium:tasks.filter((task)=>task.priority==="medium").length,
    low:tasks.filter((task)=>task.priority==="low").length,
  };

  const maxPriorityCount=
    Math.max(
      priorityCounts.high,
      priorityCounts.medium,
      priorityCounts.low,
    );

  return (
    <section className="dashboardAnalytics">
      <header className="dashboardAnalytics__header">
        <div>
          <span className="dashboardAnalytics__eyebrow">
            Insights
          </span>

          <h1>Analytics</h1>

          <p>
            Review productivity and task
            completion across your workspace.
          </p>
        </div>
      </header>

      <div className="dashboardAnalytics__grid">
        <article className="dashboardAnalytics__card dashboardAnalytics__card--plain">
          <div className="dashboardAnalytics__cardBody">
            <small>Total tasks</small>
            <strong>{tasks.length}</strong>
            <span>
              Across current workspace
            </span>
          </div>
        </article>

        <article className="dashboardAnalytics__card">
          <div className="dashboardAnalytics__cardBody">
            <small>Active</small>
            <strong>{active}</strong>
            <span>
              Tasks still in progress
            </span>
          </div>

          <ProgressRing
            percent={activeRate}
            color="#5b5ce2"
          />
        </article>

        <article className="dashboardAnalytics__card">
          <div className="dashboardAnalytics__cardBody">
            <small>Completed</small>
            <strong>{completed}</strong>
            <span>
              Finished workspace tasks
            </span>
          </div>

          <ProgressRing
            percent={completionRate}
            color="#10b981"
          />
        </article>

        <article className="dashboardAnalytics__card">
          <div className="dashboardAnalytics__cardBody">
            <small>
              Completion rate
            </small>
            <strong>
              {completionRate}%
            </strong>
            <span>
              Of all workspace tasks
            </span>
          </div>

          <ProgressRing
            percent={completionRate}
            color="#f59e0b"
          />
        </article>
      </div>

      <div className="dashboardAnalytics__breakdownGrid">
        <article className="analyticsBreakdown">
          <header className="analyticsBreakdown__header">
            <h2>Tasks by Category</h2>
            <p>Where your workspace's effort is going.</p>
          </header>

          <div className="analyticsBreakdown__list">
            {categoryEntries.length===0?(
              <p className="analyticsBreakdown__empty">
                No tasks yet.
              </p>
            ):(
              categoryEntries.map(({category,count})=>(
                <BreakdownBar
                  key={category}
                  label={CATEGORY_LABELS[category]}
                  count={count}
                  maxCount={maxCategoryCount}
                  color={CATEGORY_COLORS[category]}
                />
              ))
            )}
          </div>
        </article>

        <article className="analyticsBreakdown">
          <header className="analyticsBreakdown__header">
            <h2>Tasks by Priority</h2>
            <p>How urgent your open work is.</p>
          </header>

          <div className="analyticsBreakdown__list">
            <BreakdownBar
              label={PRIORITY_LABELS.high}
              count={priorityCounts.high}
              maxCount={maxPriorityCount}
              color={PRIORITY_COLORS.high}
            />
            <BreakdownBar
              label={PRIORITY_LABELS.medium}
              count={priorityCounts.medium}
              maxCount={maxPriorityCount}
              color={PRIORITY_COLORS.medium}
            />
            <BreakdownBar
              label={PRIORITY_LABELS.low}
              count={priorityCounts.low}
              maxCount={maxPriorityCount}
              color={PRIORITY_COLORS.low}
            />
          </div>
        </article>
      </div>
    </section>
  );
};

export default DashboardAnalytics;