"use client";
import React from "react";
import StudentPanel from "../components/SPFPage";
import { useAuth } from "../hooks/useAuth";

const Page = () => {
  const { user, loading } = useAuth("student");
  
  if (loading) return <div>Loading...</div>;
  if (!user) return <div>Authentication required</div>;

  return <StudentPanel userData={user} />;
};

export default Page;
