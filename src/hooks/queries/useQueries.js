
// hooks/queries/useAuthMe.js
import { useQuery } from "@tanstack/react-query";
import axios from "../../axios";

const fetchAuthMe = async () => {
  const { data } = await axios.get("/auth/me");
  return data;
};

export const useAuthMe = () => {
  return useQuery({
    queryKey: ["auth-me"],
    queryFn: fetchAuthMe,
    retry: false,
  });
};