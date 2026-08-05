import {
  FolderKanban,
  Plus,
} from "lucide-react";
import {
  useContext,
  useMemo,
  useState,
} from "react";
import {
  useNavigate,
} from "react-router-dom";
import {
  TaskContext,
} from "../../../context/TaskContext";
import {
  useProjects,
} from "../../../context/ProjectContext";
import {
  useAuth,
} from "../../../context/AuthContext";
import ProjectCard from "../../../components/dashboard/projects/ProjectCard";
import ProjectModal from "../../../components/dashboard/projects/ProjectModal";

const Projects=()=>{
  const{
    projects,
    dispatch,
  }=useProjects();

  const taskContext=
    useContext(TaskContext);

  const {
    user,
  }=useAuth();

  const navigate=
    useNavigate();

  const activeWorkspaceId=
    user?.activeWorkspaceId;

  const workspaceProjects=
    useMemo(
      ()=>projects.filter(
        (project)=>
          project.workspaceId===
          activeWorkspaceId,
      ),
      [
        projects,
        activeWorkspaceId,
      ],
    );

  const tasks=[
    ...(taskContext?.state.tasks??[]),
    ...(taskContext?.state.completedTasks??[]),
  ];

  const[
    showModal,
    setShowModal,
  ]=useState(false);

  const handleCreateProject=(
    name:string,
    description:string,
    color:string,
  )=>{

    if(!activeWorkspaceId){
      return;
    }

    dispatch({
      type:"ADD_PROJECT",
      project:{
        id:crypto.randomUUID(),
        workspaceId:activeWorkspaceId,
        name,
        description,
        color,
        createdAt:new Date().toISOString(),
      },
    });

    setShowModal(false);
  };

  const handleOpenProject=(
    projectId:string,
  )=>{
    navigate(
      `/dashboard/projects/${projectId}`,
    );
  };

  return(
    <section className="dashboardProjects">
      <header className="dashboardProjects__header">
        <div>
          <span className="dashboardProjects__eyebrow">
            Organization
          </span>

          <h1>
            Projects
          </h1>

          <p>
            Group related tasks and monitor work across your workspace.
          </p>
        </div>

        <button
          type="button"
          className="dashboardProjects__primaryButton"
          onClick={()=>
            setShowModal(true)
          }
        >
          <Plus aria-hidden="true"/>

          <span>
            New Project
          </span>
        </button>
      </header>

      <div className="dashboardProjects__card">
        {workspaceProjects.length===0?(
          <div className="dashboardProjects__empty">
            <span className="dashboardProjects__emptyIcon">
              <FolderKanban aria-hidden="true"/>
            </span>

            <h2>
              No projects yet
            </h2>

            <p>
              Create your first project to organize your work.
            </p>
          </div>
        ):(
          <div className="dashboardProjects__grid">
            {workspaceProjects.map((project)=>{
              const projectTasks=
                tasks.filter(
                  (task)=>
                    task.projectId===project.id,
                );

              const completedCount=
                projectTasks.filter(
                  (task)=>
                    task.completed,
                ).length;

              const progress=
                projectTasks.length===0
                  ?0
                  :Math.round(
                      completedCount/
                      projectTasks.length*
                      100,
                    );

              return(
                <ProjectCard
                  key={project.id}
                  id={project.id}
                  name={project.name}
                  description={
                    project.description
                  }
                  color={
                    project.color
                  }
                  taskCount={
                    projectTasks.length
                  }
                  completedCount={
                    completedCount
                  }
                  progress={
                    progress
                  }
                  onOpen={
                    handleOpenProject
                  }
                />
              );
            })}
          </div>
        )}
      </div>

      {showModal&&(
        <ProjectModal
          onClose={()=>
            setShowModal(false)
          }
          onCreate={
            handleCreateProject
          }
        />
      )}
    </section>
  );
};

export default Projects;