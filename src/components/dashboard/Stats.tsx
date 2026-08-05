import type {
  Task,
} from "../../context/TaskContext";

import { getTodayInTimeZone } from "../../utils/dates";

interface StatsProps{
  activeCount:number;
  completedCount:number;
  tasks:Task[];
}

const DEFAULT_TIME_ZONE=
  Intl.DateTimeFormat().resolvedOptions().timeZone;

const isDueToday=(
  task:Task,
):boolean=>{

  if(!task.dueDate){
    return false;
  }

  const today=
    getTodayInTimeZone(
      task.timeZone||DEFAULT_TIME_ZONE,
    );

  return task.dueDate===today;
};

const Stats=({
  activeCount,
  completedCount,
  tasks,
}:StatsProps)=>{

  const totalCount=
    activeCount+
    completedCount;

  const dueTodayCount=
    tasks.filter(
      (task)=>
        !task.completed&&
        isDueToday(task),
    ).length;

  const completionRate=
    totalCount>0
      ?Math.round(
          (
            completedCount/
            totalCount
          )*100,
        )
      :0;

  const stats=[
    {
      label:"Total Tasks",
      value:totalCount,
      detail:"Across your workspace",
      icon:"□",
      modifier:"default",
    },
    {
      label:"Active",
      value:activeCount,
      detail:"Currently in progress",
      icon:"↗",
      modifier:"primary",
    },
    {
      label:"Completed",
      value:completedCount,
      detail:`${completionRate}% completion rate`,
      icon:"✓",
      modifier:"success",
    },
    {
      label:"Due Today",
      value:dueTodayCount,
      detail:
        dueTodayCount===0
          ?"Nothing due today"
          :dueTodayCount===1
            ?"Needs your attention"
            :"Tasks needing attention",
      icon:"◷",
      modifier:"warning",
    },
  ] as const;

  return(
    <section
      className="dashboardStats"
      aria-label="Task statistics"
    >
      {stats.map(
        ({
          label,
          value,
          detail,
          icon,
          modifier,
        })=>(
          <article
            key={label}
            className={`dashboardStatCard dashboardStatCard--${modifier}`}
          >
            <div className="dashboardStatCard__top">
              <span
                className="dashboardStatCard__icon"
                aria-hidden="true"
              >
                {icon}
              </span>
            </div>

            <strong className="dashboardStatCard__value">
              {value}
            </strong>

            <span className="dashboardStatCard__label">
              {label}
            </span>

            <small className="dashboardStatCard__detail">
              {detail}
            </small>
          </article>
        ),
      )}
    </section>
  );
};

export default Stats;