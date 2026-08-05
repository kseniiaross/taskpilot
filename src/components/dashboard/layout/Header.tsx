import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { Link } from "react-router-dom";

import { useAuth } from "../../../context/AuthContext";
import WorkspaceModal from "../../WorkspaceModal";

const DashboardHeader=()=>{

  /* =========================================================================
     AUTH
     ========================================================================= */

  const {
    user,
    logoutUser,
    createNewWorkspace,
    switchCurrentWorkspace,
    updateWorkspaceName,
    updateWorkspaceColor,
  }=useAuth();


  /* =========================================================================
     STATE
     ========================================================================= */

  const [
    menuOpen,
    setMenuOpen,
  ]=useState(false);

  const [
    workspaceOpen,
    setWorkspaceOpen,
  ]=useState(false);

  const [
    showWorkspaceModal,
    setShowWorkspaceModal,
  ]=useState(false);

  const [
    workspaceMode,
    setWorkspaceMode,
  ]=useState<"create"|"edit">(
    "create",
  );


  /* =========================================================================
     REFS
     ========================================================================= */

  const menuRef=
    useRef<HTMLDivElement>(null);

  const workspaceRef=
    useRef<HTMLDivElement>(null);


  /* =========================================================================
     DERIVED VALUES
     ========================================================================= */

  const initials=
    user?.fullName
      .split(" ")
      .map(
        (part)=>part[0],
      )
      .join("")
      .toUpperCase()
      .slice(0,2)??"TP";


  const activeWorkspace=
    useMemo(
      ()=>user?.workspaces.find(
        ({id})=>
          id===user.activeWorkspaceId,
      ),
      [user],
    );


  const workspaceCount=
    user?.workspaces.length??0;


  /* =========================================================================
     HELPERS
     ========================================================================= */

  const closeMenus=()=>{
    setMenuOpen(false);
    setWorkspaceOpen(false);
  };


  const toggleWorkspaceMenu=()=>{
    setMenuOpen(false);
    setWorkspaceOpen(
      (prev)=>!prev,
    );
  };


  const toggleProfileMenu=()=>{
    setWorkspaceOpen(false);
    setMenuOpen(
      (prev)=>!prev,
    );
  };


  /* =========================================================================
     EFFECTS
     ========================================================================= */

  useEffect(()=>{

    const handleClick=(
      event:MouseEvent,
    )=>{

      const target=
        event.target as Node;


      if(
        menuRef.current &&
        !menuRef.current.contains(target)
      ){
        setMenuOpen(false);
      }


      if(
        workspaceRef.current &&
        !workspaceRef.current.contains(target)
      ){
        setWorkspaceOpen(false);
      }
    };


    document.addEventListener(
      "mousedown",
      handleClick,
    );


    return()=>document.removeEventListener(
      "mousedown",
      handleClick,
    );

  },[]);


  /* =========================================================================
     HANDLERS
     ========================================================================= */

  const handleWorkspaceCreate=(
    workspaceName:string,
    color:string,
  )=>{

    createNewWorkspace(
      workspaceName,
      color,
    );

    setWorkspaceOpen(false);
  };


  const handleWorkspaceEdit=(
    workspaceName:string,
    color:string,
  )=>{

    updateWorkspaceName(
      workspaceName,
    );

    updateWorkspaceColor(
      color,
    );
  };


  const handleWorkspaceSwitch=(
    workspaceId:string,
  )=>{

    switchCurrentWorkspace(
      workspaceId,
    );

    setWorkspaceOpen(false);
  };


  /* =========================================================================
     COMPONENT
     ========================================================================= */

  return(
    <>
      <header className="dashboardHeader">
        <div className="dashboardHeader__inner">

          <Link
            to="/"
            className="dashboardBrand"
          >
            <span className="dashboardBrand__mark">
              TP
            </span>

            <span className="dashboardBrand__text">
              <strong>
                TaskPilot
              </strong>

              <small>
                Productivity Workspace
              </small>
            </span>
          </Link>
          <div className="dashboardHeader__actions">
            <div
              ref={workspaceRef}
              className="dashboardWorkspaceSwitcher"
            >
              <button
                type="button"
                className="dashboardWorkspaceButton"
                onClick={toggleWorkspaceMenu}
              >
                <span
                  className="dashboardWorkspaceColor"
                  style={{
                    background:
                      activeWorkspace?.color ??
                      "#5b5ce2",
                  }}
                />

                <span className="dashboardWorkspaceInfo">
                  <strong>
                    {
                      activeWorkspace?.name ??
                      "Personal Workspace"
                    }
                  </strong>
                  <small>
                    Workspace
                  </small>
                </span>
                <span>
                  ▾
                </span>
              </button>
                                {workspaceOpen && (
                <div className="dashboardWorkspaceDropdown">

                  <div className="dashboardWorkspaceDropdown__header">
                    <span>
                      Your Workspaces
                    </span>
                    <small>
                      {workspaceCount} workspace
                      {workspaceCount!==1
                        ?"s"
                        :""
                      }
                    </small>
                  </div>
                  {user?.workspaces.map(
                    (workspace)=>{

                      const isActive=
                        workspace.id===
                        user.activeWorkspaceId;


                      return(
                        <button
                          key={workspace.id}
                          type="button"
                          className={
                            `dashboardWorkspaceItem ${
                              isActive
                              ?"dashboardWorkspaceItem--active"
                              :""
                            }`
                          }
                          onClick={()=>
                            handleWorkspaceSwitch(
                              workspace.id,
                            )
                          }
                        >
                          <span
                            className="dashboardWorkspaceItem__color"
                            style={{
                              background:
                                workspace.color,
                            }}
                          />
                          <div className="dashboardWorkspaceItem__content">
                            <span>
                              {workspace.name}
                            </span>
                            {isActive&&(
                              <small>
                                ✓ Active
                              </small>
                            )}
                          </div>
                        </button>
                      );
                    },
                  )}
                  <div className="dashboardDropdown__divider"/>
                  <button
                    type="button"
                    className="dashboardWorkspaceCreate"
                    onClick={()=>{
                      setWorkspaceMode("create");
                      setWorkspaceOpen(false);
                      setShowWorkspaceModal(true);
                    }}
                  >
                    + Create Workspace
                  </button>
                  {activeWorkspace&&(
                    <button
                      type="button"
                      className="dashboardWorkspaceCreate"
                      onClick={()=>{
                        setWorkspaceMode("edit");
                        setWorkspaceOpen(false);
                        setShowWorkspaceModal(true);
                      }}
                    >
                      Edit Current Workspace
                    </button>
                  )}
                </div>
              )}
            </div>
            <div
              ref={menuRef}
              className="dashboardUser"
            >
              <button
                type="button"
                className="dashboardProfile"
                onClick={toggleProfileMenu}
              >
                <span className="dashboardProfile__avatar">
                  {initials}
                </span>
                <span className="dashboardProfile__details">

                  <strong>
                    {user?.fullName??"Guest"}
                  </strong>
                  <small>
                    Workspace Owner
                  </small>
                </span>
                <span className="dashboardProfile__chevron">
                  ▾
                </span>
              </button>
              {menuOpen&&(
                <div className="dashboardDropdown">
                  <div className="dashboardDropdown__header">
                    <div className="dashboardDropdown__avatar">
                      {initials}
                    </div>
                    <div>
                      <strong>
                        {user?.fullName??"Guest"}
                      </strong>
                      <small>
                        {
                          user?.email??
                          "guest@example.com"
                        }
                      </small>
                      <span>
                        {
                          activeWorkspace?.name??
                          "Personal Workspace"
                        }
                     </span>
                    </div>
                  </div>
                  <div className="dashboardDropdown__divider"/>
                  <Link
                    to="/profile"
                    className="dashboardDropdown__item"
                    onClick={closeMenus}
                  >
                    Profile
                  </Link>
                  <Link
                    to="/settings"
                    className="dashboardDropdown__item"
                    onClick={closeMenus}
                  >
                    Settings
                  </Link>
                  <div className="dashboardDropdown__divider"/>
                  <button
                    type="button"
                    className="dashboardDropdown__logout"
                    onClick={logoutUser}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
      {showWorkspaceModal&&(
        <WorkspaceModal
          onClose={()=>
            setShowWorkspaceModal(false)
          }
          mode={
            workspaceMode
          }
          initialName={
            activeWorkspace?.name
          }
          initialColor={
            activeWorkspace?.color
          }
          onSubmit={
            workspaceMode==="create"
            ?handleWorkspaceCreate
            :handleWorkspaceEdit
          }
        />
      )}
    </>
  );
};

export default DashboardHeader;