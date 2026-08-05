import {
  AUTH_KEY,
  USER_KEY,
  TASKS_KEY,
  PROJECTS_KEY,
} from "./constants";

import type {
  User,
} from "../types/auth";


export const login=()=>{

  localStorage.setItem(
    AUTH_KEY,
    "true",
  );

};


export const logout=()=>{

  localStorage.removeItem(
    AUTH_KEY,
  );

};


export const deleteAccount=()=>{

  localStorage.removeItem(
    USER_KEY,
  );

  localStorage.removeItem(
    AUTH_KEY,
  );

  localStorage.removeItem(
    TASKS_KEY,
  );

  localStorage.removeItem(
    PROJECTS_KEY,
  );

};


export const isAuthenticated=():boolean=>{

  return(
    localStorage.getItem(
      AUTH_KEY,
    )==="true"
  );

};


export const saveStoredUser=(
  user:User,
)=>{

  localStorage.setItem(
    USER_KEY,
    JSON.stringify(user),
  );

};


export const getStoredUser=():User|null=>{

  const value=
    localStorage.getItem(
      USER_KEY,
    );

  if(!value){
    return null;
  }

  try{

    return JSON.parse(
      value,
    ) as User;

  }catch{

    return null;

  }

};