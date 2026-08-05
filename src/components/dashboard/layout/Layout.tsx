import { useState } from "react";
import { Outlet } from "react-router-dom";

import Header from "./Header";
import Sidebar from "./Sidebar";

const Layout=()=>{
  const[
    sidebarCollapsed,
    setSidebarCollapsed,
  ]=useState(false);

  const handleSidebarToggle=()=>{
    setSidebarCollapsed(
      (current)=>!current,
    );
  };

  return(
    <div className="taskPilotDashboard">
      <Header/>

      <main
        className={`dashboardLayout${
          sidebarCollapsed
            ?" dashboardLayout--collapsed"
            :""
        }`}
      >
        <Sidebar
          collapsed={sidebarCollapsed}
          onToggle={handleSidebarToggle}
        />

        <section className="dashboardContent">
          <Outlet/>
        </section>
      </main>
    </div>
  );
};

export default Layout;