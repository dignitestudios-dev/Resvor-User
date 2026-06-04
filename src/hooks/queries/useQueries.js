
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


const fetchLounges = async () => {
  const { data } = await axios.get("/lounges/list");
  return data;
};

export const useLounges = () => {
  return useQuery({
    queryKey: ["lounges"],
    queryFn: fetchLounges,
    retry: false,
  });
};

const fetchLoungeDetails = async (loungeId) => {
  const { data } = await axios.get(`/lounges/${loungeId}`);
  return data;
};

export const useLoungeDetails = (loungeId) => {
  return useQuery({
    queryKey: ["lounge-details", loungeId],
    queryFn: () => fetchLoungeDetails(loungeId),
    enabled: !!loungeId,
    retry: false,
  });
};