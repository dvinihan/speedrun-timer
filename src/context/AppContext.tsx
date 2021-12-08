import { createContext, useContext, useState } from "react";

type AppContextTypes = {
  isRunning: boolean;
  setIsRunning: (isRunning: boolean) => void;
  showEditSegments: boolean;
  setShowEditSegments: (showEditSegments: boolean) => void;
  runningTime: number;
  setRunningTime: (time: number) => void;
  startedAtTime: number;
  setStartedAtTime: (time: number) => void;
};

const AppContext = createContext<AppContextTypes | undefined>(undefined);

export const AppContextProvider = ({ children }: { children: any }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [showEditSegments, setShowEditSegments] = useState(false);
  const [runningTime, setRunningTime] = useState(0);
  const [startedAtTime, setStartedAtTime] = useState(0);

  return (
    <AppContext.Provider
      value={{
        isRunning,
        setIsRunning,
        showEditSegments,
        setShowEditSegments,
        runningTime,
        setRunningTime,
        startedAtTime,
        setStartedAtTime,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
