import axios from "../../axios";

export const deleteGuest = async (entryId) => {
  const { data } = await axios.delete(`/guestbook/${entryId}`);
  return data;
};