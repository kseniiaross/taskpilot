import type {
  User,
  Workspace,
} from "../types/auth";

import {
  login,
  getStoredUser,
  saveStoredUser,
} from "./authStorage";

export const saveUser=(
  user:Omit<
    User,
    "workspaces"|"activeWorkspaceId"
  >,
):User=>{

  const defaultWorkspace:Workspace={
    id:crypto.randomUUID(),
    name:
      user.workspaceName?.trim()||
      "Personal Workspace",
    color:"#5b5ce2",
  };

  const newUser:User={
    ...user,
    workspaces:[
      defaultWorkspace,
    ],
    activeWorkspaceId:
      defaultWorkspace.id,
  };

  saveStoredUser(
    newUser,
  );

  login();

  return newUser;
};


export const updateUser=(
  updates:Partial<
    Pick<User,"fullName">
  >,
):User|null=>{

  const current=
    getStoredUser();

  if(!current){
    return null;
  }

  const updated:User={
    ...current,
    ...updates,
  };

  saveStoredUser(
    updated,
  );

  return updated;
};


export const updateWorkspace=(
  name:string,
):User|null=>{

  const current=
    getStoredUser();

  if(
    !current||
    !current.activeWorkspaceId
  ){
    return null;
  }

  const updated:User={
    ...current,
    workspaces:
      current.workspaces.map(
        (workspace:Workspace)=>
          workspace.id===
          current.activeWorkspaceId
            ?{
                ...workspace,
                name:
                  name.trim()||
                  "Personal Workspace",
              }
            :workspace,
      ),
  };

  saveStoredUser(
    updated,
  );

  return updated;
};


export const updateWorkspaceColor=(
  color:string,
):User|null=>{

  const current=
    getStoredUser();

  if(
    !current||
    !current.activeWorkspaceId
  ){
    return null;
  }

  const updated:User={
    ...current,
    workspaces:
      current.workspaces.map(
        (workspace:Workspace)=>
          workspace.id===
          current.activeWorkspaceId
            ?{
                ...workspace,
                color,
              }
            :workspace,
      ),
  };

  saveStoredUser(
    updated,
  );

  return updated;
};


export const createWorkspace=(
  name:string,
  color:string,
):User|null=>{

  const current=
    getStoredUser();

  if(!current){
    return null;
  }

  const workspace:Workspace={
    id:crypto.randomUUID(),
    name:
      name.trim()||
      "New Workspace",
    color,
  };

  const updated:User={
    ...current,
    workspaces:[
      ...current.workspaces,
      workspace,
    ],
    activeWorkspaceId:
      workspace.id,
  };

  saveStoredUser(
    updated,
  );

  return updated;
};


export const switchWorkspace=(
  id:string,
):User|null=>{

  const current=
    getStoredUser();

  if(!current){
    return null;
  }

  const exists=
    current.workspaces.some(
      (workspace:Workspace)=>
        workspace.id===id,
    );

  if(!exists){
    return current;
  }

  const updated:User={
    ...current,
    activeWorkspaceId:id,
  };

  saveStoredUser(
    updated,
  );

  return updated;
};