import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router";
import ReactQueryProvider from "./providers/ReactQueryProvider.jsx";
import { ToasterContainer } from "./components/global/Toaster.jsx";
import { AppContextProvider } from "./context/AppContext.jsx";
import { SocketProvider } from "./context/SocketContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ReactQueryProvider>
      <ToasterContainer />
      <BrowserRouter>
        <AppContextProvider>
          <SocketProvider>
            <App />
          </SocketProvider>
        </AppContextProvider>
      </BrowserRouter>
    </ReactQueryProvider>
  </StrictMode>,
);
