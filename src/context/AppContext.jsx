/* eslint-disable react/prop-types */
import { createContext, useContext, useState } from "react";

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const [stepName, setStepName] = useState("");

  return (
    <AppContext.Provider
      value={{
        stepName,
        setStepName,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

const useApp = () => {
  return useContext(AppContext);
};

export default useApp;
