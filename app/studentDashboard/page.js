"use client";
import React from "react";
import StudentDashboard from "../components/FPage";
import { useGetStudentDashboardQuery } from "../services/queries";

const StudentDashboardPage = () => {
  const userId = "usr_3"; // Replace with actual user ID from auth
  const { data, isLoading, error } = useGetStudentDashboardQuery(userId);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading dashboard</div>;


  return <StudentDashboard dashboardData={data} />;
};

export default StudentDashboardPage;
