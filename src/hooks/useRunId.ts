import { useMemo } from "react";
import { useRunsData } from "./useRunsData";

export const useRunId = () => {
  const { latestRunSegments } = useRunsData();
  return useMemo(() => latestRunSegments?.[0]?.runId, [latestRunSegments]);
};
