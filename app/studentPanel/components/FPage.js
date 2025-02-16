"use client"; // Add this at the top
import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import TaskPanel from "./TaskPanel";

const StudentPanel = () => {
  const [activeTab, setActiveTab] = useState("panel");

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="flex-1 p-6">
        <Header />
        {activeTab === "panel" && <TaskPanel />}
      </div>
    </div>
  );
};

export default StudentPanel;
