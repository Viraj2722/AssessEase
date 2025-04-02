import axios from "axios";
import { API_URL } from "../lib/utils.js";
import { useQuery } from "@tanstack/react-query";

// Example of what your query function might look like
export const useGetStudentDashboardQuery = (userId) => {
  return useQuery({
    queryKey: ['studentDashboard', userId],
    queryFn: async () => {
      if (!userId) throw new Error('User ID is required');
      const response = await axios.get(`${API_URL}/student/dashboard/${userId}`);
      return response.data;
    },
    enabled: !!userId // Only run the query if userId exists
  });
};


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

  // console.log("semester",semester, subjectId, division, taskId);
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

  // console.log("final ",semester, subjectId, division);
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



// Add this to your existing queries.js file

export function useGetSubmissionByFilePathQuery(filePath) {
  return useQuery({
    queryKey: ["getSubmissionByFilePath", filePath],
    queryFn: async () => {
      if (!filePath) return null;

      return (await axios.get(
        `${API_URL}/submission/id-by-filepath/${encodeURIComponent(filePath)}`
      )).data;
    },
    enabled: Boolean(filePath),
    retry: false,
  });
}
// export const useGenerateTeacherReportQuery = (teacherSubjectId) => {
//   // This is a custom hook that returns the fetch function
//   // It doesn't use useQuery directly because we want to call it on demand
  
//   const fetchReport = async () => {
//     try {
//       const response = await axios.get(`${API_URL}/teacher/generate-report/${teacherSubjectId}`);
//       return response.data;
//     } catch (error) {
//       console.error('Error fetching report:', error);
//       throw error;
//     }
//   };

//   return fetchReport;
// };

// Add this to your existing queries.js file
export function useGetTasksByFiltersQuery() {
  return async (semester, subjectId, division) => {
    try {
      const response = await axios.get(
        `${API_URL}/tasks/by-filters?semester=${semester}&subjectId=${subjectId}&division=${division}`
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching tasks by filters:', error);
      throw error;
    }
  };
}
