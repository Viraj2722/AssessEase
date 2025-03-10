"use client";
import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./SPHeader";
import TaskPanel from "./TaskPanel";
import { useGetStudentTasksQuery } from "../services/queries.js";

const StudentPanel = () => {
  const [activeTab, setActiveTab] = useState("panel");
  const [taskStatus, setTaskStatus] = useState("pending");
  const studentId = "std_1"; // Get this from your auth context

  const { isPending, isSuccess, data } = useGetStudentTasksQuery(taskStatus, studentId);

  const handleStatusChange = (newStatus) => {
    setTaskStatus(newStatus);
  };

  if (isPending) return <div>Loading...</div>;

  if (isSuccess) {
    return (
      <div className="flex min-h-screen bg-gray-100">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <div className="flex-1 p-6">
          <Header onStatusChange={handleStatusChange} />
          {activeTab === "panel" && <TaskPanel data={data.data} />}
        </div>
      </div>
    );
  }
};

export default StudentPanel;
