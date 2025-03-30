"use client";
import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Header from "./SPHeader";
import TaskPanel from "./TaskPanel";
import { useGetStudentTasksQuery } from "../services/queries.js";
import { useAuth } from "../hooks/useAuth";

const StudentPanel = ({ userData }) => {
  const [activeTab, setActiveTab] = useState("panel");
  const [taskStatus, setTaskStatus] = useState("pending");
  const [recentlySubmittedTasks, setRecentlySubmittedTasks] = useState([]);
  
  // Use the authenticated user data passed from the parent component
  // or get it directly using the useAuth hook
  const { user } = useAuth("student");
  const authenticatedUser = userData || user;
  
  // Extract the student ID from the user object
  // Adjust the path based on your actual user object structure
  const studentId = authenticatedUser?.student?.id ;
  const userId = authenticatedUser?.user?.id;

  // console.log("Student ID:", authenticatedUser);

  const { isPending, isSuccess, data, refetch } = useGetStudentTasksQuery(taskStatus, studentId);

  // When task status changes to "submitted", refetch to get the latest data
  useEffect(() => {
    if (taskStatus === "submitted" && recentlySubmittedTasks.length > 0) {
      refetch();
      // Clear the recently submitted tasks after refetching
      setRecentlySubmittedTasks([]);
    }
  }, [taskStatus, recentlySubmittedTasks, refetch]);

  const handleStatusChange = (newStatus) => {
    setTaskStatus(newStatus);
  };

  const handleTaskSubmitted = async (taskId) => {
    // Add the task to recently submitted tasks
    setRecentlySubmittedTasks(prev => [...prev, taskId]);
    
    // Refetch the current view
    await refetch();
  };

  if (isPending) return <div>Loading...</div>;
  if (!studentId) return <div>Student information not available</div>;

  if (isSuccess) {
    // If we're viewing submitted tasks, we should see all submitted tasks including recent ones
    let displayData = data.data;
    
    // If we're viewing pending tasks, filter out recently submitted ones
    if (taskStatus === "pending") {
      displayData = data.data.filter(task => !recentlySubmittedTasks.includes(task.taskId));
    }

    return (
      <div className="flex min-h-screen bg-gray-100">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <div className="flex-1 p-6">
          <Header onStatusChange={handleStatusChange} />
          {activeTab === "panel" && (
            <TaskPanel 
              data={displayData} 
              onTaskSubmitted={handleTaskSubmitted} 
              taskStatus={taskStatus}
            />
          )}
        </div>
      </div>
    );
  }
};

export default StudentPanel;
