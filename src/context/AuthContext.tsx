import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";

import {
  createWorkspace,
  switchWorkspace,
  updateUser,
  updateWorkspace,
  updateWorkspaceColor as saveWorkspaceColor,
} from "../utils/authHelpers";

import {
  deleteAccount,
  getStoredUser as getUser,
  isAuthenticated,
  logout,
} from "../utils/authStorage";

import type {
  User,
} from "../types/auth";

/* =========================================================================
   TYPES
   ========================================================================= */

export interface AuthContextType{
  user:User|null;
  authenticated:boolean;
  loginUser:(user:User)=>void;
  logoutUser:()=>void;
  refreshUser:()=>void;
  updateCurrentUser:(
    updates:Partial<Pick<User,"fullName">>,
  )=>void;
  updateWorkspaceName:(
    name:string,
  )=>void;
  updateWorkspaceColor:(
    color:string,
  )=>void;
  createNewWorkspace:(
    name:string,
    color:string,
  )=>void;
  switchCurrentWorkspace:(
    id:string,
  )=>void;
  deleteCurrentAccount:()=>void;
}

export const AuthContext=
  createContext<AuthContextType|null>(
    null,
  );

interface AuthProviderProps{
  children:ReactNode;
}

/* =========================================================================
   PROVIDER
   ========================================================================= */

export const AuthProvider=({
  children,
}:AuthProviderProps)=>{

  const[user,setUser]=
    useState<User|null>(
      () => getUser(),
    );

  const[authenticated,setAuthenticated]=
    useState(
      () => isAuthenticated(),
    );

  /* =========================================================================
     AUTH
     ========================================================================= */

  const loginUser=(
    currentUser:User,
  )=>{
    setAuthenticated(true);
    setUser(currentUser);
  };

  const logoutUser=()=>{

    logout();

    setAuthenticated(false);
    setUser(null);

    window.location.href="/";
  };

  const refreshUser=()=>{

    setAuthenticated(
      isAuthenticated(),
    );

    setUser(
      getUser(),
    );
  };

  /* =========================================================================
     USER
     ========================================================================= */

  const updateCurrentUser=(
    updates:Partial<Pick<User,"fullName">>,
  )=>{

    const updated=
      updateUser(updates);

    if(updated){
      setUser(updated);
    }
  };

  /* =========================================================================
     WORKSPACE
     ========================================================================= */

  const updateWorkspaceName=(
    name:string,
  )=>{

    const updated=
      updateWorkspace(name);

    if(updated){
      setUser(updated);
    }
  };

  const updateWorkspaceColor=(
    color:string,
  )=>{

    const updated=
      saveWorkspaceColor(color);

    if(updated){
      setUser(updated);
    }
  };

  const createNewWorkspace=(
    name:string,
    color:string,
  )=>{

    const updated=
      createWorkspace(
        name,
        color,
      );

    if(updated){
      setUser(updated);
    }
  };

  const switchCurrentWorkspace=(
    id:string,
  )=>{

    const updated=
      switchWorkspace(id);

    if(updated){
      setUser(updated);
    }
  };

  /* =========================================================================
     ACCOUNT
     ========================================================================= */

  const deleteCurrentAccount=()=>{

    deleteAccount();

    setAuthenticated(false);
    setUser(null);

    window.location.href="/";
  };

  /* =========================================================================
     CONTEXT
     ========================================================================= */

  return(
    <AuthContext.Provider
      value={{
        user,
        authenticated,
        loginUser,
        logoutUser,
        refreshUser,
        updateCurrentUser,
        updateWorkspaceName,
        updateWorkspaceColor,
        createNewWorkspace,
        switchCurrentWorkspace,
        deleteCurrentAccount,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

/* =========================================================================
   HOOK
   ========================================================================= */

export const useAuth=()=>{

  const context=
    useContext(AuthContext);

  if(!context){
    throw new Error(
      "useAuth must be used inside AuthProvider",
    );
  }

  return context;
};