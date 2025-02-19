import axios from "axios";
import { API_URL } from "../lib/utils.js";
import { useQuery } from "@tanstack/react-query";

export function useGetStudentDashboardQuery(userId) {
  return useQuery({
    queryKey: ["getStudentDashboard"],
    queryFn: async () => {
      return (await axios.get(`${API_URL}/student/dashboard/${userId}`)).data;
    },
    refetchOnWindowFocus: false,
    retry: false,
  });
}

export function useGetStudentTasksQuery(status, studentId) {
  return useQuery({
    queryKey: ["getStudentTasks"],
    queryFn: async () => {
      return (await axios.get(`${API_URL}/student/tasks/${status}?studentId=${studentId}`)).data;
    },
    refetchOnWindowFocus: true,
    retry: false,
  });
}
