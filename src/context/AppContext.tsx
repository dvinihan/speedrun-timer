import { createContext, useContext, useState } from "react";
import { RunType } from "../constants";
import { RunSegment } from "../types/RunSegment";

type AppContextTypes = {
  isRunning: boolean;
  setIsRunning: (isRunning: boolean) => void;
  showEditSegments: boolean;
  setShowEditSegments: (showEditSegments: boolean) => void;
  runningTime: number;
  setRunningTime: (time: number) => void;
  startedAtTime: number;
  setStartedAtTime: (time: number) => void;
  currentRunSegments: RunSegment[];
  setCurrentRunSegments: (
    segments:
      | RunSegment[]
      | ((currentRunSegments: RunSegment[]) => RunSegment[])
  ) => void;
  runType: RunType;
  setRunType: (runType: RunType) => void;
};

const AppContext = createContext<AppContextTypes | undefined>(undefined);

export const AppContextProvider = ({ children }: { children: any }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [showEditSegments, setShowEditSegments] = useState(false);
  const [runningTime, setRunningTime] = useState(0);
  const [startedAtTime, setStartedAtTime] = useState(0);
  const [runType, setRunType] = useState(RunType.WORLD_PEACE);

  const [currentRunSegments, setCurrentRunSegments] = useState<RunSegment[]>(
    []
  );

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
        currentRunSegments,
        setCurrentRunSegments,
        runType,
        setRunType,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
