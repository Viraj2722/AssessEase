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
    queryKey: ["getStudentTasks", status, studentId],
    queryFn: async () => {
      return (await axios.get(`${API_URL}/student/tasks/${status}?studentId=${studentId}`)).data;
    },
    refetchOnWindowFocus: true,
    retry: false,
  });
}
export function useGetTeacherDashboardQuery(semester, subjectId, division, taskId) {
  return useQuery({
    queryKey: ["getTeacherDashboard", semester, subjectId, division, taskId],
    queryFn: async () => {
      return (await axios.get(`${API_URL}/teacher/dashboard?semester=${semester}&subjectId=${subjectId}&division=${division}&taskId=${taskId}`)).data;
    },
    refetchOnWindowFocus: true,
    retry: false,
  });
}

export function useGetTeacherStudentsListQuery(semester, subjectId, division, taskId) {
  return useQuery({
    queryKey: ["getTeacherStudentsList", semester, subjectId, division, taskId],
    queryFn: async () => {
      if (!semester || !subjectId || !division || !taskId) return null;
      return (await axios.get(
        `${API_URL}/teacher/students-list?semester=${semester}&subjectId=${subjectId}&division=${division}&taskId=${taskId}`
      )).data;
    },
    enabled: Boolean(semester && subjectId && division && taskId)
  });
}
export function useGetTeacherReportQuery(teacherSubjectId) {
  return useQuery({
    queryKey: ["getTeacherReport", teacherSubjectId],
    queryFn: async () => {
      return (await axios.get(`${API_URL}/teacher/generate-report/${teacherSubjectId}`)).data;
    },
    refetchOnWindowFocus: false,
    retry: false,
  });
}

export function useGetStudentFileQuery(key) {
  return useQuery({
    queryKey: ["getStudentFile", key],
    queryFn: async () => {
      return (await axios.get(`${API_URL}/student/file/${key}`)).data;
    },
    refetchOnWindowFocus: false,
    retry: false,
  });
}


export function useGetTeacherTasksQuery(semester, subjectId, division) {

  
  return useQuery({
    queryKey: ["getTeacherTasks", semester, subjectId, division],
    queryFn: async () => {
      if (!semester || !subjectId || !division) return [];
      
      return (await axios.get(
        `${API_URL}/teacher/tasks?semester=${semester}&subjectId=${subjectId}&division=${division}`
      )).data;
    },
    enabled: Boolean(semester && subjectId && division)
  });
}



