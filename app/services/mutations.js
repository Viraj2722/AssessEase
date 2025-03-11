import axios from "axios";
import { API_URL } from "../lib/utils";
import { useMutation } from "@tanstack/react-query";

export function useAddTaskMutation() {
  return useMutation({
    mutationKey: ["addTask"],
    mutationFn: async (data) => {
      const taskData = {
        teacherSubjectId: data.teacherSubjectId,
        semester: data.semester,
        taskType: data.taskType,
        title: data.title,
        dueDate: data.dueDate,
        totalMarks: data.totalMarks,
        division: data.division
      };

      return (
        await axios.post(`${API_URL}/teacher/addTask`, taskData, {
          headers: { "Content-Type": "application/json" },
        })
      ).data;
    },
    retry: false,
  });
}

export function useUploadSubmissionMutation() {
  return useMutation({
    mutationKey: ["uploadSubmission"],
    mutationFn: async ({ file, taskId, studentId }) => {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("taskId", taskId);
      formData.append("studentId", studentId);

      return (
        await axios.post(`${API_URL}/student/submission/upload`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
      ).data;
    },
  });
}