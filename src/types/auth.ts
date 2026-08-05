export interface AuthUser {
  id: string;
  email: string;
  fullName: string;
  workspaceName: string;
}

export interface StoredAuthUser extends AuthUser {
  passwordHash: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  fullName: string;
  email: string;
  password: string;
  workspaceName?: string;
}
export interface Workspace{
  id:string;
  name:string;
  color:string;
}

export interface User{
  fullName:string;
  email:string;
  // Stored in plain text because this is a frontend-only demo app with
  // no backend to hash/verify credentials against. Do not use this
  // pattern in a real authentication system.
  password:string;
  workspaceName?:string;
  workspaces:Workspace[];
  activeWorkspaceId:string;
}