import {
  useRef,
  useState,
  type FormEvent,
} from "react";

import { useModal } from "../hooks/useModal";

const WORKSPACE_COLORS=[
  "#5b5ce2",
  "#2b84ff",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#ec4899",
];

interface WorkspaceModalProps{
  onClose:()=>void;
  mode:"create"|"edit";
  initialName?:string;
  initialColor?:string;
  onSubmit:(
    workspaceName:string,
    color:string,
  )=>void;
}

const WorkspaceModal=({
  onClose,
  mode,
  initialName="",
  initialColor=WORKSPACE_COLORS[0],
  onSubmit,
}:WorkspaceModalProps)=>{

  const [workspaceName,setWorkspaceName]=
    useState(initialName);

  const [color,setColor]=
    useState(initialColor);

  const nameInputRef=
    useRef<HTMLInputElement>(null);

  const { handleOverlayMouseDown }=
    useModal({
      onClose,
      focusRef:nameInputRef,
    });

  const handleSubmit=(
    event:FormEvent<HTMLFormElement>,
  )=>{
    event.preventDefault();

    const trimmedName=
      workspaceName.trim();

    if(!trimmedName){
      return;
    }

    onSubmit(
      trimmedName,
      color,
    );

    onClose();
  };

  return(
    <div
      className="workspaceModalOverlay"
      role="presentation"
      onMouseDown={handleOverlayMouseDown}
    >
      <div
        className="workspaceModal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="workspace-modal-title"
        aria-describedby="workspace-modal-description"
      >

        <div className="workspaceModal__header">
          <div>
            <span className="workspaceModal__eyebrow">
              Workspace
            </span>

            <h2 id="workspace-modal-title">
              {
                mode==="create"
                ?"Create Workspace"
                :"Edit Workspace"
              }
            </h2>

            <p id="workspace-modal-description">
              {
                mode==="create"
                ?"Create another workspace for a new project or team."
                :"Update your workspace name and theme color."
              }
            </p>
          </div>

          <button
            type="button"
            className="workspaceModal__close"
            aria-label="Close modal"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        <form
          className="workspaceModal__form"
          onSubmit={handleSubmit}
        >

          <label className="workspaceField">
            <span>
              Workspace Name
            </span>

            <input
              ref={nameInputRef}
              type="text"
              placeholder="Marketing Team"
              value={workspaceName}
              onChange={(event)=>
                setWorkspaceName(
                  event.target.value,
                )
              }
              required
            />
          </label>


          <div className="workspaceField">
            <span>
              Theme Color
            </span>

            <div
              className="workspaceColors"
              role="group"
              aria-label="Workspace color"
            >
              {
                WORKSPACE_COLORS.map(
                  (item)=>(
                    <button
                      key={item}
                      type="button"
                      aria-label={`Select ${item} color`}
                      aria-pressed={color===item}
                      className={
                        `workspaceColor ${
                          color===item
                          ?"workspaceColor--active"
                          :""
                        }`
                      }
                      style={{
                        background:item,
                      }}
                      onClick={()=>
                        setColor(item)
                      }
                    />
                  ),
                )
              }
            </div>
          </div>


          <div className="workspaceModal__actions">

            <button
              type="button"
              className="workspaceCancelButton"
              onClick={onClose}
            >
              Cancel
            </button>


            <button
              type="submit"
              className="workspaceCreateButton"
            >
              {
                mode==="create"
                ?"Create Workspace"
                :"Save Changes"
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default WorkspaceModal;