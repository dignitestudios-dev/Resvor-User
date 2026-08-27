/* eslint-disable react/prop-types */
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import Cookies from "js-cookie";
import { baseUrl } from "../axios";

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  // Store the socket instance in STATE so consumers re-render when it's ready.
  // Using only a ref means consumers get null on mount and never update.
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const token =
      Cookies.get("token") || localStorage.getItem("token");

    if (!token) return;

    const socketInstance = io(baseUrl, {
      auth: { token: `Bearer ${token}` },
      transports: ["websocket"],
      reconnectionAttempts: 5,
      reconnectionDelay: 2000,
    });

    // Put the instance in state so all consumers re-render with the real socket
    setSocket(socketInstance);

    socketInstance.on("connect", () => {
      console.log("🟢 Socket connected:", socketInstance.id);
      setIsConnected(true);
    });

    socketInstance.on("disconnect", (reason) => {
      console.log("🔴 Socket disconnected:", reason);
      setIsConnected(false);
    });

    socketInstance.on("connect_error", (err) => {
      console.error("❌ Socket connection error:", err.message);
    });

    return () => {
      socketInstance.disconnect();
      setSocket(null);
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  return useContext(SocketContext);
};

export default SocketContext;
