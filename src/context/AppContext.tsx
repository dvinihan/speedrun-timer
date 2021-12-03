import { createContext, useContext, useState } from "react";

type AppContextTypes = {
  currentSegmentId: number;
  setCurrentSegmentId: (id: number) => void;
  isRunning: boolean;
  setIsRunning: (isRunning: boolean) => void;
};

const AppContext = createContext<AppContextTypes | undefined>(undefined);

export const AppContextProvider = ({ children }: { children: any }) => {
  const [currentSegmentId, setCurrentSegmentId] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  return (
    <AppContext.Provider
      value={{ currentSegmentId, setCurrentSegmentId, isRunning, setIsRunning }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
