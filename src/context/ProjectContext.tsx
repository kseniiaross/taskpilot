import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  type ReactNode,
} from "react";

import { PROJECTS_KEY as STORAGE_KEY } from "../utils/constants";

const DEFAULT_PROJECT_COLOR="#5b5ce2";

export interface Project{
  id:string;
  workspaceId:string;
  name:string;
  description:string;
  color:string;
  createdAt:string;
}

interface ProjectState{
  projects:Project[];
}

export type ProjectAction=
  |{
      type:"ADD_PROJECT";
      project:Project;
    }
  |{
      type:"DELETE_PROJECT";
      id:string;
    }
  |{
      type:"UPDATE_PROJECT";
      project:Project;
    };

interface StoredProject{
  id?:unknown;
  workspaceId?:unknown;
  name?:unknown;
  description?:unknown;
  color?:unknown;
  createdAt?:unknown;
}

interface StoredProjectState{
  projects?:unknown;
}

const defaultState:ProjectState={
  projects:[],
};

const normalizeProject=(
  project:StoredProject,
):Project|null=>{
  if(
    typeof project.id!=="string"||
    typeof project.name!=="string"
  ){
    return null;
  }

  return{
    id:project.id,
    workspaceId:
      typeof project.workspaceId==="string"
        ?project.workspaceId
        :"",
    name:project.name.trim()||"Untitled Project",
    description:
      typeof project.description==="string"
        ?project.description.trim()
        :"",
    color:
      typeof project.color==="string"&&
      project.color.trim().length>0
        ?project.color
        :DEFAULT_PROJECT_COLOR,
    createdAt:
      typeof project.createdAt==="string"
        ?project.createdAt
        :new Date().toISOString(),
  };
};

const getInitialState=():ProjectState=>{
  const savedState=
    localStorage.getItem(STORAGE_KEY);

  if(!savedState){
    return defaultState;
  }

  try{
    const parsedState=
      JSON.parse(savedState) as StoredProjectState;

    if(!Array.isArray(parsedState.projects)){
      return defaultState;
    }

    return{
      projects:parsedState.projects
        .map((project)=>
          normalizeProject(
            project as StoredProject,
          ),
        )
        .filter(
          (project):project is Project=>
            project!==null,
        ),
    };
  }catch{
    localStorage.removeItem(STORAGE_KEY);

    return defaultState;
  }
};

const projectReducer=(
  state:ProjectState,
  action:ProjectAction,
):ProjectState=>{
  switch(action.type){
    case"ADD_PROJECT":
      return{
        ...state,
        projects:[
          ...state.projects,
          action.project,
        ],
      };

    case"DELETE_PROJECT":
      return{
        ...state,
        projects:state.projects.filter(
          (project)=>
            project.id!==action.id,
        ),
      };

    case"UPDATE_PROJECT":
      return{
        ...state,
        projects:state.projects.map(
          (project)=>
            project.id===action.project.id
              ?action.project
              :project,
        ),
      };

    default:
      return state;
  }
};

interface ProjectContextProps{
  projects:Project[];
  dispatch:React.Dispatch<ProjectAction>;
  getProjectById:(
    projectId:string,
  )=>Project|undefined;
}

export const ProjectContext=
  createContext<ProjectContextProps|undefined>(
    undefined,
  );

interface ProjectProviderProps{
  children:ReactNode;
}

export const ProjectProvider=({
  children,
}:ProjectProviderProps)=>{
  const[
    state,
    dispatch,
  ]=useReducer(
    projectReducer,
    undefined,
    getInitialState,
  );

  useEffect(()=>{
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(state),
    );
  },[
    state,
  ]);

  const getProjectById=(
    projectId:string,
  )=>
    state.projects.find(
      (project)=>
        project.id===projectId,
    );

  return(
    <ProjectContext.Provider
      value={{
        projects:state.projects,
        dispatch,
        getProjectById,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};

export const useProjects=()=>{
  const context=
    useContext(ProjectContext);

  if(!context){
    throw new Error(
      "useProjects must be used inside ProjectProvider",
    );
  }

  return context;
};