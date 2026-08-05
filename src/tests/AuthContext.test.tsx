import {
  describe,
  expect,
  it,
  beforeEach,
  vi,
} from "vitest";

import {
  renderHook,
  act,
} from "@testing-library/react";

import {
  useContext,
} from "react";

import {
  AuthProvider,
  AuthContext,
} from "../context/AuthContext";


const mockUser = {
  id: "user-1",
  email: "kseniia@test.com",
  password: "test-password-1",
  fullName: "Kseniia Developer",
  activeWorkspaceId: "workspace-1",
  workspaces: [
    {
      id: "workspace-1",
      name: "Personal",
      color: "#000000",
    },
  ],
};


vi.mock(
  "../utils/authHelpers",
  () => ({
    updateUser: vi.fn(
      (
        updates,
      ) => ({
        ...mockUser,
        ...updates,
      }),
    ),

    createWorkspace: vi.fn(
      (
        name,
        color,
      ) => ({
        ...mockUser,
        workspaces:[
          ...mockUser.workspaces,
          {
            id:"workspace-2",
            name,
            color,
          },
        ],
      }),
    ),

    switchWorkspace: vi.fn(
      (
        id,
      ) => ({
        ...mockUser,
        activeWorkspaceId:id,
      }),
    ),

    updateWorkspace: vi.fn(
      (
        name,
      ) => ({
        ...mockUser,
        workspaces:[
          {
            ...mockUser.workspaces[0],
            name,
          },
        ],
      }),
    ),

    updateWorkspaceColor: vi.fn(
      (
        color,
      ) => ({
        ...mockUser,
        workspaces:[
          {
            ...mockUser.workspaces[0],
            color,
          },
        ],
      }),
    ),
  }),
);


vi.mock(
  "../utils/authStorage",
  () => ({
    isAuthenticated: vi.fn(() => false),

    getStoredUser: vi.fn(() => null),

    logout: vi.fn(),

    deleteAccount: vi.fn(),
  }),
);


const wrapper = ({
  children,
}:{
  children:React.ReactNode;
}) => (
  <AuthProvider>
    {children}
  </AuthProvider>
);


const useAuthContext = () => {
  const context =
    useContext(
      AuthContext,
    );

  if(!context){
    throw new Error(
      "AuthContext missing",
    );
  }

  return context;
};


describe(
  "AuthContext",
  () => {

    beforeEach(()=>{
      localStorage.clear();
    });


    it(
      "logs in user",
      ()=>{
        const {
          result,
        } =
        renderHook(
          ()=>useAuthContext(),
          {
            wrapper,
          },
        );


        act(()=>{
          result.current.loginUser(
            mockUser,
          );
        });


        expect(
          result.current.authenticated,
        ).toBe(true);


        expect(
          result.current.user?.email,
        ).toBe(
          "kseniia@test.com",
        );
      },
    );


    it(
      "logs out user",
      ()=>{
        const {
          result,
        } =
        renderHook(
          ()=>useAuthContext(),
          {
            wrapper,
          },
        );


        act(()=>{
          result.current.loginUser(
            mockUser,
          );
        });


        act(()=>{
          result.current.logoutUser();
        });


        expect(
          result.current.user,
        ).toBe(null);


        expect(
          result.current.authenticated,
        ).toBe(false);
      },
    );


    it(
      "updates current user name",
      ()=>{
        const {
          result,
        } =
        renderHook(
          ()=>useAuthContext(),
          {
            wrapper,
          },
        );


        act(()=>{
          result.current.loginUser(
            mockUser,
          );
        });


        act(()=>{
          result.current.updateCurrentUser({
            fullName:"New Name",
          });
        });


        expect(
          result.current.user?.fullName,
        ).toBe(
          "New Name",
        );
      },
    );


    it(
      "creates new workspace",
      ()=>{
        const {
          result,
        } =
        renderHook(
          ()=>useAuthContext(),
          {
            wrapper,
          },
        );


        act(()=>{
          result.current.loginUser(
            mockUser,
          );
        });


        act(()=>{
          result.current.createNewWorkspace(
            "Work",
            "#FF0000",
          );
        });


        expect(
          result.current.user?.workspaces.length,
        ).toBe(2);
      },
    );


    it(
      "switches workspace",
      ()=>{
        const {
          result,
        } =
        renderHook(
          ()=>useAuthContext(),
          {
            wrapper,
          },
        );


        act(()=>{
          result.current.loginUser(
            mockUser,
          );
        });


        act(()=>{
          result.current.switchCurrentWorkspace(
            "workspace-2",
          );
        });


        expect(
          result.current.user?.activeWorkspaceId,
        ).toBe(
          "workspace-2",
        );
      },
    );


    it(
      "updates workspace name",
      ()=>{
        const {
          result,
        } =
        renderHook(
          ()=>useAuthContext(),
          {
            wrapper,
          },
        );


        act(()=>{
          result.current.loginUser(
            mockUser,
          );
        });


        act(()=>{
          result.current.updateWorkspaceName(
            "Personal Updated",
          );
        });


        expect(
          result.current.user?.workspaces[0].name,
        ).toBe(
          "Personal Updated",
        );
      },
    );

  },
);