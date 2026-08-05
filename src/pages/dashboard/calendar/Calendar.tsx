import{
  useContext,
  useMemo,
  useState,
}from"react";
import{
  ChevronLeft,
  ChevronRight,
}from"lucide-react";
import{
  TaskContext,
}from"../../../context/TaskContext";
import{
  useAuth,
}from"../../../context/AuthContext";

const WEEK_DAYS=[
  "Sun",
  "Mon",
  "Tue",
  "Wed",
  "Thu",
  "Fri",
  "Sat",
];

const Calendar=()=>{

  const context=
    useContext(TaskContext);

  const{
    user,
  }=useAuth();

  const[
    currentDate,
    setCurrentDate,
  ]=useState(
    new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      1,
    ),
  );

  const allTasks=[
    ...(context?.state.tasks??[]),
    ...(context?.state.completedTasks??[]),
  ].filter(
    (task)=>
      task.workspaceId===
      user?.activeWorkspaceId,
  );

  const calendarDays=
    useMemo(()=>{
      const year=
        currentDate.getFullYear();

      const month=
        currentDate.getMonth();

      const firstDay=
        new Date(
          year,
          month,
          1,
        ).getDay();

      const daysInMonth=
        new Date(
          year,
          month+1,
          0,
        ).getDate();

      const cells:Array<number|null>=[];

      for(
        let index=0;
        index<firstDay;
        index+=1
      ){
        cells.push(null);
      }

      for(
        let day=1;
        day<=daysInMonth;
        day+=1
      ){
        cells.push(day);
      }

      while(
        cells.length%7!==0
      ){
        cells.push(null);
      }

      return cells;
    },[
      currentDate,
    ]);

  const moveMonth=(
    direction:number,
  )=>{
    setCurrentDate(
      (previous)=>
        new Date(
          previous.getFullYear(),
          previous.getMonth()+direction,
          1,
        ),
    );
  };

  const getDateKey=(
    day:number,
  )=>{
    const year=
      currentDate.getFullYear();

    const month=String(
      currentDate.getMonth()+1,
    ).padStart(
      2,
      "0",
    );

    const date=String(
      day,
    ).padStart(
      2,
      "0",
    );

    return`${year}-${month}-${date}`;
  };

  const today=
    new Date();

  const isToday=(
    day:number,
  )=>
    day===today.getDate()&&
    currentDate.getMonth()===today.getMonth()&&
    currentDate.getFullYear()===today.getFullYear();

  const monthTitle=
    currentDate.toLocaleDateString(
      "en-US",
      {
        month:"long",
        year:"numeric",
      },
    );

  return(
    <section className="dashboardCalendar">
      <header className="dashboardCalendar__pageHeader">
        <div>
          <span className="dashboardCalendar__eyebrow">
            Schedule
          </span>
          <h1>
            Calendar
          </h1>
          <p>
            Keep track of deadlines and upcoming workspace tasks.
          </p>
        </div>
      </header>

      <div className="dashboardCalendar__container">
        <header className="dashboardCalendar__header">
          <h2>
            {monthTitle}
          </h2>

          <div className="dashboardCalendar__actions">
            <button
              type="button"
              onClick={()=>
                moveMonth(-1)
              }
              aria-label="Previous month"
            >
              <ChevronLeft/>
            </button>

            <button
              type="button"
              className="dashboardCalendar__today"
              onClick={()=>
                setCurrentDate(
                  new Date(
                    today.getFullYear(),
                    today.getMonth(),
                    1,
                  ),
                )
              }
            >
              Today
            </button>

            <button
              type="button"
              onClick={()=>
                moveMonth(1)
              }
              aria-label="Next month"
            >
              <ChevronRight/>
            </button>
          </div>
        </header>

        <div className="dashboardCalendar__body">
          <div className="dashboardCalendar__weekdays">
            {WEEK_DAYS.map(
              (weekDay)=>(
                <span key={weekDay}>
                  {weekDay}
                </span>
              ),
            )}
          </div>

          <div className="dashboardCalendar__grid">
            {calendarDays.map(
              (day,index)=>{

                if(!day){
                  return(
                    <div
                      key={`empty-${index}`}
                      className="dashboardCalendar__day dashboardCalendar__day--empty"
                    />
                  );
                }

                const dateKey=
                  getDateKey(day);

                const dayTasks=
                  allTasks.filter(
                    (task)=>
                      task.dueDate===dateKey,
                  );

                return(
                  <article
                    key={dateKey}
                    className={
                      isToday(day)
                        ?"dashboardCalendar__day dashboardCalendar__day--today"
                        :"dashboardCalendar__day"
                    }
                  >
                    <span className="dashboardCalendar__number">
                      {day}
                    </span>

                    <div className="dashboardCalendar__tasks">

                      {dayTasks
                        .slice(0,2)
                        .map(
                          (task)=>(
                            <div
                              key={task.id}
                              className={
                                task.completed
                                  ?"dashboardCalendar__task dashboardCalendar__task--completed"
                                  :"dashboardCalendar__task"
                              }
                              title={task.title}
                            >
                              {task.title}
                            </div>
                          ),
                        )}

                      {dayTasks.length>2&&(
                        <small className="dashboardCalendar__more">
                          +{dayTasks.length-2} more
                        </small>
                      )}

                    </div>
                  </article>
                );
              },
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Calendar;