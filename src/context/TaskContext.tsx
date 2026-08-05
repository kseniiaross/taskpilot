import{
  createContext,
  useEffect,
  useReducer,
  type ReactNode,
}from"react";

import { TASKS_KEY as STORAGE_KEY } from "../utils/constants";

const DEFAULT_TIME_ZONE=
  Intl.DateTimeFormat().resolvedOptions().timeZone;

export type TaskCategory=
  |"project"
  |"meeting"
  |"work"
  |"study"
  |"personal"
  |"shopping"
  |"health";

export interface Task{
  id:string;
  workspaceId:string;
  projectId:string;
  title:string;
  description:string;
  dueDate:string;
  dueTime:string;
  timeZone:string;
  priority:"low"|"medium"|"high";
  category:TaskCategory;
  completed:boolean;
  order:number;
}

interface TaskState{
  tasks:Task[];
  completedTasks:Task[];
}

export type TaskAction=
  |{
      type:"ADD_TASK";
      task:Omit<Task,"order">;
    }
  |{
      type:"TOGGLE_TASK";
      id:string;
    }
  |{
      type:"COMPLETE_TASK";
      id:string;
    }
  |{
      type:"DELETE_TASK";
      id:string;
    }
  |{
      type:"EDIT_TASK";
      task:Task;
    }
  |{
      type:"REORDER_TASKS";
      scope:"active"|"completed";
      reorderedList:Task[];
    };

const defaultState:TaskState={
  tasks:[],
  completedTasks:[],
};

const normalizeTask=(
  task:Task,
  completed:boolean,
  fallbackOrder:number,
):Task=>({
  ...task,
  projectId:task.projectId??"",
  dueTime:task.dueTime??"",
  timeZone:
    task.timeZone??
    DEFAULT_TIME_ZONE,
  order:
    typeof task.order==="number"
      ?task.order
      :fallbackOrder,
  completed,
});

const getInitialState=():TaskState=>{
  const savedState=
    localStorage.getItem(STORAGE_KEY);

  if(!savedState){
    return defaultState;
  }

  try{
    const parsedState=
      JSON.parse(savedState) as Partial<TaskState>;

    return{
      tasks:Array.isArray(parsedState.tasks)
        ?parsedState.tasks.map(
            (task,index)=>
              normalizeTask(
                task,
                false,
                index,
              ),
          )
        :[],
      completedTasks:Array.isArray(
        parsedState.completedTasks,
      )
        ?parsedState.completedTasks.map(
            (task,index)=>
              normalizeTask(
                task,
                true,
                index,
              ),
          )
        :[],
    };
  }catch{
    localStorage.removeItem(STORAGE_KEY);
    return defaultState;
  }
};

/* =========================================================================
   ORDER HELPERS

   `order` powers the "Newest"/"Oldest" sort and drag-and-drop reordering.
   Higher `order` = created or moved more recently. It is computed across
   both active and completed tasks so the two lists stay comparable.
   ========================================================================= */

const getNextOrder=(
  state:TaskState,
):number=>{

  const orders=[
    ...state.tasks.map(
      (task)=>task.order,
    ),
    ...state.completedTasks.map(
      (task)=>task.order,
    ),
  ];

  return orders.length>0
    ?Math.max(...orders)+1
    :0;
};

const taskReducer=(
  state:TaskState,
  action:TaskAction,
):TaskState=>{
  switch(action.type){
    case"ADD_TASK":
      return{
        ...state,
        tasks:[
          ...state.tasks,
          {
            ...action.task,
            completed:false,
            order:getNextOrder(state),
          },
        ],
      };
    case"TOGGLE_TASK":{
      const activeTask=
        state.tasks.find(
          (task)=>
            task.id===action.id,
        );

      if(activeTask){
        return{
          tasks:state.tasks.filter(
            (task)=>
              task.id!==action.id,
          ),
          completedTasks:[
            ...state.completedTasks,
            {
              ...activeTask,
              completed:true,
            },
          ],
        };
      }

      const completedTask=
        state.completedTasks.find(
          (task)=>
            task.id===action.id,
        );

      if(completedTask){
        return{
          tasks:[
            ...state.tasks,
            {
              ...completedTask,
              completed:false,
            },
          ],
          completedTasks:
            state.completedTasks.filter(
              (task)=>
                task.id!==action.id,
            ),
        };
      }

      return state;
    }
    case"COMPLETE_TASK":{
      const taskToComplete=
        state.tasks.find(
          (task)=>
            task.id===action.id,
        );

      if(!taskToComplete){
        return state;
      }

      return{
        tasks:state.tasks.filter(
          (task)=>
            task.id!==action.id,
        ),
        completedTasks:[
          ...state.completedTasks,
          {
            ...taskToComplete,
            completed:true,
          },
        ],
      };
    }
    case"DELETE_TASK":
      return{
        tasks:state.tasks.filter(
          (task)=>
            task.id!==action.id,
        ),
        completedTasks:
          state.completedTasks.filter(
            (task)=>
              task.id!==action.id,
          ),
      };
    case"EDIT_TASK":{
      const existsInActive=
        state.tasks.some(
          (task)=>
            task.id===action.task.id,
        );

      const existsInCompleted=
        state.completedTasks.some(
          (task)=>
            task.id===action.task.id,
        );

      if(
        existsInActive&&
        action.task.completed
      ){
        return{
          tasks:state.tasks.filter(
            (task)=>
              task.id!==action.task.id,
          ),
          completedTasks:[
            ...state.completedTasks,
            action.task,
          ],
        };
      }

      if(
        existsInCompleted&&
        !action.task.completed
      ){
        return{
          tasks:[
            ...state.tasks,
            action.task,
          ],
          completedTasks:
            state.completedTasks.filter(
              (task)=>
                task.id!==action.task.id,
            ),
        };
      }

      return{
        tasks:state.tasks.map(
          (task)=>
            task.id===action.task.id
              ?action.task
              :task,
        ),
        completedTasks:
          state.completedTasks.map(
            (task)=>
              task.id===action.task.id
                ?action.task
                :task,
          ),
      };
    }
    case"REORDER_TASKS":{

      const base=
        getNextOrder(state);

      const reassigned=
        action.reorderedList.map(
          (task,index)=>({
            ...task,
            order:
              base+
              (
                action.reorderedList.length-
                index
              ),
          }),
        );

      return action.scope==="active"
        ?{
            ...state,
            tasks:reassigned,
          }
        :{
            ...state,
            completedTasks:reassigned,
          };
    }
    default:
      return state;
  }
};

interface TaskContextProps{
  state:TaskState;
  dispatch:React.Dispatch<TaskAction>;
}

export const TaskContext=
  createContext<TaskContextProps|undefined>(
    undefined,
  );

interface TaskProviderProps{
  children:ReactNode;
}

export const TaskProvider=({
  children,
}:TaskProviderProps)=>{
  const[state,dispatch]=
    useReducer(
      taskReducer,
      undefined,
      getInitialState,
    );

  useEffect(()=>{
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(state),
    );
  },[state]);

  return(
    <TaskContext.Provider
      value={{
        state,
        dispatch,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};