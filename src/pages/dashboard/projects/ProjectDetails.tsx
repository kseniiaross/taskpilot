import{
  ArrowLeft,
  FolderOpen,
  Plus,
}from"lucide-react";
import{
  useContext,
  useState,
}from"react";
import{
  Link,
  useParams,
}from"react-router-dom";
import{
  useAuth,
}from"../../../context/AuthContext";
import TaskModal from"../../../components/dashboard/tasks/TaskModal";
import{
  TaskContext,
  type Task,
  type TaskCategory,
}from"../../../context/TaskContext";
import TaskCard from"../../../components/dashboard/tasks/TaskCard";
import{
  useProjects,
}from"../../../context/ProjectContext";

const ProjectDetails=()=>{

  const{
    projectId,
  }=useParams();

  const{
    getProjectById,
  }=useProjects();

  const{
    user,
  }=useAuth();

  const taskContext=
    useContext(TaskContext);

  const[
    showTaskModal,
    setShowTaskModal,
  ]=useState(false);

  const[
    editingTask,
    setEditingTask,
  ]=useState<Task|null>(null);

  const project=
    getProjectById(
      projectId??"",
    );

  const tasks=[
    ...(taskContext?.state.tasks??[]),
    ...(taskContext?.state.completedTasks??[]),
  ].filter(
    (task)=>
      task.projectId===projectId,
  );

  const completed=
    tasks.filter(
      (task)=>
        task.completed,
    ).length;

  const progress=
    tasks.length===0
      ?0
      :Math.round(
          completed/
          tasks.length*
          100,
        );

  const handleToggleTask=(
    taskId:string,
  )=>{

    if(!taskContext){
      return;
    }

    taskContext.dispatch({
      type:"TOGGLE_TASK",
      id:taskId,
    });

  };

  const handleDeleteTask=(taskId:string)=>{

  if(!taskContext){
    return;
  }

  taskContext.dispatch({
    type:"DELETE_TASK",
    id:taskId,
  });

};

  const handleEditTask=(task:Task)=>{
    setEditingTask(task);
    setShowTaskModal(true);

  };

  const handleNewTask=()=>{
    setEditingTask(null);
    setShowTaskModal(true);

  };

  const handleCreateTask=(
    title:string,
    description:string,
    dueDate:string,
    dueTime:string,
    timeZone:string,
    priority:Task["priority"],
    category:TaskCategory,
    selectedProjectId:string,
  )=>{

    if(!taskContext){
  return;
}

if(editingTask){

  taskContext.dispatch({
    type:"EDIT_TASK",
    task:{
      ...editingTask,
      projectId:
        selectedProjectId||
        projectId||
        "",
      title,
      description,
      dueDate,
      dueTime,
      timeZone,
      priority,
      category,
  },
  });

  setEditingTask(null);
  setShowTaskModal(false);
  return;

}

taskContext.dispatch({
  type:"ADD_TASK",
  task:{
    id:crypto.randomUUID(),
    workspaceId:
      user?.activeWorkspaceId??
      "",
    projectId:
      selectedProjectId||
      projectId||
      "",
    title,
    description,
    dueDate,
    dueTime,
    timeZone,
    priority,
    category,
    completed:false,
  },
});

setShowTaskModal(false);
};

  return(
    <section className="projectDetails">
      <header className="projectDetails__header">
        <div className="projectDetails__left">
          <Link
            to="/dashboard/projects"
            className="projectDetails__back"
          >
            <ArrowLeft/>

            <span>
              Back to Projects
            </span>
          </Link>

          <span className="projectDetails__eyebrow">
            PROJECT
          </span>

          <h1>
            {
              project?.name??
              "Project"
            }
          </h1>

          <p>
            {
              project?.description||
              "Organize your work and keep every task in one place."
            }
          </p>
        </div>

        <button
          type="button"
          className="projectDetails__button"
          onClick={handleNewTask}
        >
          <Plus/>

          <span>
            New Task
          </span>
        </button>
      </header>
            <section className="projectDetails__stats">
        <div className="projectDetails__progress">
          <div className="projectDetails__progressHeader">
            <div>
              <strong>
                {completed}
                {" / "}
                {tasks.length}
              </strong>

              <span>
                completed
              </span>
            </div>

            <strong>
              {progress}%
            </strong>
          </div>

          <div className="projectDetails__progressBar">
            <div
              className="projectDetails__progressFill"
              style={{
                width:`${progress}%`,
              }}
            />
          </div>
        </div>
      </section>

      {
        tasks.length===0?(
          <section className="projectDetails__empty">
            <div className="projectDetails__emptyIcon">
              <FolderOpen/>
            </div>

            <h2>
              No tasks yet
            </h2>

            <p>
              Start building this project by creating your first task.
            </p>

            <button
              type="button"
              className="projectDetails__button"
              onClick={handleNewTask}
            >
              <Plus/>

              <span>
                Create First Task
              </span>
            </button>
          </section>
        ):(
          <section className="projectDetails__tasks">
            {tasks.map(task=>(
              <TaskCard
                key={task.id}
                task={task}
                compact
                hideDrag
                hideDelete
                projectLabel={project?.name??"Project"}
                onComplete={handleToggleTask}
                onDelete={handleDeleteTask}
                onEdit={handleEditTask}
              />
            ))}
          </section>
        )
      }
            {showTaskModal&&(
        <TaskModal
          task={editingTask}
          defaultProjectId={projectId}
          hideProjectSelect
          onClose={()=>{
            setEditingTask(null);
            setShowTaskModal(false);
          }}
          onSubmit={handleCreateTask}
        />
      )}
    </section>
  );
};

export default ProjectDetails;