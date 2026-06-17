import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "../../axios";

// ... existing code ...
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

const fetchAvailableTables = async ({ loungeId, date, startTime, endTime }) => {
  const { data } = await axios.get("/bookings/available-tables", {
    params: {
      loungeId,
      date,
      startTime,
      endTime,
    },
  });
  return data;
};

export const useAvailableTables = (loungeId, date, startTime, endTime) => {
  return useQuery({
    queryKey: ["available-tables", loungeId, date, startTime, endTime],
    queryFn: () => fetchAvailableTables({ loungeId, date, startTime, endTime }),
    enabled: !!(loungeId && date && startTime && endTime),
    retry: false,
  });
};

const createBooking = async (payload) => {
  const { data } = await axios.post("/bookings", payload);
  return data;
};

export const useCreateBooking = () => {
  return useMutation({
    mutationFn: createBooking,
  });
};

const createEvent = async (payload) => {
  const { data } = await axios.post("/events", payload);
  return data;
};

export const useCreateEvent = () => {
  return useMutation({
    mutationFn: createEvent,
  });
};

const fetchFavorites = async () => {
  const { data } = await axios.get("/favorites");
  return data;
};

export const useFavorites = (options = {}) => {
  return useQuery({
    queryKey: ["favorites"],
    queryFn: fetchFavorites,
    retry: false,
    ...options,
  });
};

const toggleFavorite = async (loungeId) => {
  const { data } = await axios.post(`/favorites/${loungeId}`);
  return data;
};

export const useToggleFavorite = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: toggleFavorite,
    onSuccess: (_, loungeId) => {
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
      queryClient.invalidateQueries({ queryKey: ["lounges"] });
      queryClient.invalidateQueries({ queryKey: ["lounge-details", loungeId] });
    },
  });
};

const fetchBookings = async ({ page = 1, limit = 10 } = {}) => {
  const { data } = await axios.get("/bookings", {
    params: { page, limit },
  });
  return data;
};

export const useBookings = (params, options = {}) => {
  return useQuery({
    queryKey: ["bookings", params],
    queryFn: () => fetchBookings(params),
    retry: false,
    ...options,
  });
};

const fetchEvents = async ({ page = 1, limit = 10 } = {}) => {
  const { data } = await axios.get("/events", {
    params: { page, limit },
  });
  return data;
};

export const useEvents = (params, options = {}) => {
  return useQuery({
    queryKey: ["events", params],
    queryFn: () => fetchEvents(params),
    retry: false,
    ...options,
  });
};

const fetchEventDetails = async (eventId) => {
  const { data } = await axios.get(`/events/${eventId}`);
  return data;
};

export const useEventDetails = (eventId) => {
  return useQuery({
    queryKey: ["event-details", eventId],
    queryFn: () => fetchEventDetails(eventId),
    enabled: !!eventId,
    retry: false,
  });
};

const cancelEvent = async (eventId) => {
  const { data } = await axios.patch(`/events/${eventId}/cancel`);
  return data;
};

export const useCancelEvent = () => {
  return useMutation({
    mutationFn: cancelEvent,
  });
};

const fetchBookingDetails = async (bookingId) => {
  const { data } = await axios.get(`/bookings/${bookingId}`);
  return data;
};

export const useBookingDetails = (bookingId) => {
  return useQuery({
    queryKey: ["booking-details", bookingId],
    queryFn: () => fetchBookingDetails(bookingId),
    enabled: !!bookingId,
    retry: false,
  });
};

const cancelBooking = async (bookingId) => {
  const { data } = await axios.patch(`/bookings/${bookingId}/cancel`);
  return data;
};

export const useCancelBooking = () => {
  return useMutation({
    mutationFn: cancelBooking,
  });
};
