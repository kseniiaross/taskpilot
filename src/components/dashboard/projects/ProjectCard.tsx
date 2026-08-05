import{
  FolderKanban,
}from"lucide-react";

interface ProjectCardProps{
  id:string;
  name:string;
  description:string;
  color:string;
  taskCount:number;
  completedCount:number;
  progress:number;
  onOpen:(projectId:string)=>void;
}

const ProjectCard=({
  id,
  name,
  description,
  color,
  taskCount,
  completedCount,
  progress,
  onOpen,
}:ProjectCardProps)=>{
  return(
    <article className="projectCard">
      <div className="projectCard__top">
        <div
          className="projectCard__icon"
          style={{
            background:color,
          }}
        >
          <FolderKanban
            aria-hidden="true"
          />
        </div>

        <span className="projectCard__percent">
          {progress}%
        </span>
      </div>

      <div className="projectCard__content">
        <h3>
          {name}
        </h3>

        <p>
          {description||"No description yet."}
        </p>
      </div>

      <div className="projectCard__stats">
        <div className="projectCard__stat">
          <strong>
            {taskCount}
          </strong>

          <span>
            Tasks
          </span>
        </div>

        <div className="projectCard__stat">
          <strong>
            {completedCount}
          </strong>

          <span>
            Completed
          </span>
        </div>
      </div>

      <div className="projectCard__progress">
        <div
          className="projectCard__progressFill"
          style={{
            width:`${progress}%`,
          }}
        />
      </div>

      <button
        type="button"
        className="projectCard__button"
        onClick={()=>
          onOpen(id)
        }
      >
        Open Project
      </button>
    </article>
  );
};

export default ProjectCard;