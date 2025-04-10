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

      console.log("Task data:", taskData);


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




export function useSaveMarksMutation() {
  return useMutation({
    mutationKey: ["saveMarks"],
    mutationFn: async ({ submissionId, marksData, teacherId }) => {
      // console.log("Mutation received:", { submissionId, marksData, teacherId });

      // Validate required data
      if (!submissionId) {
        throw new Error("submissionId is required");
      }
      if (!teacherId) {
        throw new Error("teacherId is required");
      }
      if (!marksData.marks || Object.keys(marksData.marks).length === 0) {
        throw new Error("marks are required");
      }

      // Convert marks object to array of question-mark pairs
      const marksArray = Object.entries(marksData.marks).map(([questionKey, marksObtained]) => ({
        submissionId,
        questionNumber: parseInt(questionKey.replace('Q', '')),
        marksObtained: parseFloat(marksObtained),
        comments: marksData.comments || "",
        markedBy: teacherId
      }));

      console.log("Sending marks array:", marksArray);

      try {
        const response = await axios.post(`${API_URL}/teacher/save-marks`, {
          marks: marksArray
        }, {
          headers: { "Content-Type": "application/json" },
        });
        return response.data;
      } catch (error) {
        console.error("Error response:", error.response?.data);
        throw error;
      }
    },
    retry: false,
  });
}


export function useDeleteTaskMutation() {
  return useMutation({
    mutationKey: ["deleteTask"],
    mutationFn: async (taskId) => {
      if (!taskId) {
        throw new Error("taskId is required");
      }

      return (
        await axios.delete(`${API_URL}/teacher/task/${taskId}`, {
          headers: { "Content-Type": "application/json" },
        })
      ).data;
    },
    retry: false,
  });
}
