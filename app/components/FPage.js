"use client";
import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import StudentInfo from "./StudentInfo";

const StudentDashboard = ({ dashboardData }) => {
  const [activeTab, setActiveTab] = useState("dashboard");

  console.log(dashboardData);

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="flex-1 p-6">
        <Header />
        {activeTab === "dashboard" && <StudentInfo studentData={dashboardData} />}
      </div>
    </div>
  );
};

export default StudentDashboard;
