import { useState, useEffect } from "react";
import axios from "../../axios";
import { processError } from "../../lib/utils";

const useUsers = (url, currentPage = 1) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState({});

  const getUsers = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${url}?page=${currentPage}`);
      setData(data?.data);
      setPagination(data?.pagination);
    } catch (error) {
      processError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  return { loading, data, pagination };
};

export { useUsers };


export const getGuestBook = async (paramsOrPage = 1, limit = 20, filters = {}, signal) => {
  let queryParams = {};
  let abortSignal = signal;
  if (typeof paramsOrPage === "object" && paramsOrPage !== null) {
    queryParams = { ...paramsOrPage };
    if (limit && typeof limit !== "number" && !signal) {
      abortSignal = limit;
    }
  } else {
    queryParams = {
      page: paramsOrPage,
      limit,
      ...filters,
    };
  }

  const response = await axios.get("/guestbook", {
    params: queryParams,
    signal: abortSignal,
  });

  return response.data;
};