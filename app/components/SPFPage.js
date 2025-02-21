"use client"; 
import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./SPHeader";
import TaskPanel from "./TaskPanel";
import { useGetStudentTasksQuery } from "../services/queries.js";

const StudentPanel = () => {
  const [activeTab, setActiveTab] = useState("panel");

  const { isPending, isSuccess, data } = useGetStudentTasksQuery("pending", "std_1");

  if (isPending) return <div>Loading...</div>;

  if (isSuccess) {
    return (
      <div className="flex min-h-screen bg-gray-100">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <div className="flex-1 p-6">
          <Header />
          {activeTab === "panel" && <TaskPanel data={data.data} />}
        </div>
      </div>
    );
  }

};

export default StudentPanel;
