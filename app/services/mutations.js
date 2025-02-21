import axios from "axios";
import { API_URL } from "../lib/utils";
import { useMutation } from "@tanstack/react-query";

export function useAddTaskMutation() {
  return useMutation({
    mutationKey: ["addTask"],
    mutationFn: async (data) => {
      return (
        await axios.post(`${API_URL}/teacher/addTask`, data, {
          headers: { "Content-Type": "application/json" },
        })
      ).data;
    },
    retry: false,
  });
}
