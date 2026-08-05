import {
  type FormEvent,
  useRef,
  useState,
} from "react";
import {
  X,
} from "lucide-react";

import { useModal } from "../../../hooks/useModal";


const PROJECT_COLORS=[
  "#5b5ce2",
  "#2b84ff",
  "#2fb46d",
  "#ff8a1e",
  "#ef5da8",
];

interface ProjectModalProps{
  onClose:()=>void;
  onCreate:(
    name:string,
    description:string,
    color:string,
  )=>void;
}

const ProjectModal=({
  onClose,
  onCreate,
}:ProjectModalProps)=>{
  const nameInputRef=
    useRef<HTMLInputElement>(null);
  const[name,setName]=
    useState("");
  const[description,setDescription]=
    useState("");
  const[color,setColor]=
    useState(PROJECT_COLORS[0]);
  const normalizedName=
    name.trim();
  const normalizedDescription=
    description.trim();
  const isSubmitDisabled=
    normalizedName.length===0;

  const { handleOverlayMouseDown }=
    useModal({
      onClose,
      focusRef:nameInputRef,
    });

  const handleSubmit=(
    event:FormEvent<HTMLFormElement>,
  )=>{
    event.preventDefault();
    if(isSubmitDisabled){
      return;
    }
    onCreate(
      normalizedName,
      normalizedDescription,
      color,
    );
  };

  return(
    <div
      className="projectModalOverlay"
      role="presentation"
      onMouseDown={handleOverlayMouseDown}
    >
      <section
        className="projectModal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="project-modal-title"
        aria-describedby="project-modal-description"
      >
        <header className="projectModal__header">
          <div>
            <span className="projectModal__eyebrow">
              Project workspace
            </span>
            <h2 id="project-modal-title">
              Create Project
            </h2>
            <p id="project-modal-description">
              Add a name, description and color for your new project.
            </p>
          </div>
          <button
            type="button"
            className="projectModal__close"
            aria-label="Close project modal"
            onClick={onClose}
          >
            <X aria-hidden="true"/>
          </button>
        </header>
        <form
          className="projectModal__form"
          onSubmit={handleSubmit}
        >
          <label className="projectModalField">
            <span>
              Project Name
              <strong aria-hidden="true">
                *
              </strong>
            </span>
            <input
              ref={nameInputRef}
              type="text"
              value={name}
              maxLength={60}
              required
              autoComplete="off"
              placeholder="Website redesign"
              onChange={(event)=>
                setName(event.target.value)
              }
            />
            <small>
              {name.length}/60
            </small>
          </label>
          <label className="projectModalField">
            <span>
              Description
            </span>
            <textarea
              rows={4}
              value={description}
              maxLength={180}
              placeholder="Describe the goal of this project..."
              onChange={(event)=>
                setDescription(
                  event.target.value,
                )
              }
            />
            <small>
              {description.length}/180
            </small>
          </label>
          <div className="projectModalField">
            <span>
              Project Color
            </span>
            <div
              className="projectModalColors"
              role="group"
              aria-label="Project color"
            >
              {PROJECT_COLORS.map(
                (item)=>(
                  <button
                    key={item}
                    type="button"
                    className={`projectModalColor${
                      color===item
                        ?" projectModalColor--active"
                        :""
                    }`}
                    aria-label={`Select ${item} color`}
                    aria-pressed={color===item}
                    style={{
                      background:item,
                    }}
                    onClick={()=>
                      setColor(item)
                    }
                  />
                ),
              )}
            </div>
          </div>
          <footer className="projectModal__actions">
            <button
              type="button"
              className="projectModal__cancel"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="projectModal__submit"
              disabled={isSubmitDisabled}
            >
              Create Project
            </button>
          </footer>
        </form>
      </section>
    </div>
  );
};

export default ProjectModal;