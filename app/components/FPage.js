"use client";
import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import StudentInfo from "./StudentInfo";

const StudentDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="flex-1 p-6">
        <Header />
        {activeTab === "dashboard" && <StudentInfo />}
      </div>
    </div>
  );
};

export default StudentDashboard;
