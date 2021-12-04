import { createContext, useContext, useState } from "react";

type AppContextTypes = {
  currentSegmentId: number;
  setCurrentSegmentId: (id: number) => void;
  isRunning: boolean;
  setIsRunning: (isRunning: boolean) => void;
  showEditSegments: boolean;
  setShowEditSegments: (showEditSegments: boolean) => void;
  runId: number | undefined;
  setRunId: (id?: number) => void;
};

const AppContext = createContext<AppContextTypes | undefined>(undefined);

export const AppContextProvider = ({ children }: { children: any }) => {
  const [currentSegmentId, setCurrentSegmentId] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [showEditSegments, setShowEditSegments] = useState(false);
  const [runId, setRunId] = useState<number | undefined>();

  return (
    <AppContext.Provider
      value={{
        currentSegmentId,
        setCurrentSegmentId,
        isRunning,
        setIsRunning,
        showEditSegments,
        setShowEditSegments,
        runId,
        setRunId,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
