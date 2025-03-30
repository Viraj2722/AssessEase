"use client";
import React from "react";
import StudentDashboard from "../components/FPage";
import { useGetStudentDashboardQuery } from "../services/queries";
import { useAuth } from "../hooks/useAuth";

const StudentDashboardPage = () => {
  const { user, loading } = useAuth("student");
  
  // Use the authenticated user's ID instead of static "usr_4"
  const userId = user?.user?.id;
  const { data, isLoading, error } = useGetStudentDashboardQuery(userId);

  if (loading || isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading dashboard</div>;
  if (!user) return <div>Authentication required</div>;

  return <StudentDashboard dashboardData={data} />;
};

export default StudentDashboardPage;
