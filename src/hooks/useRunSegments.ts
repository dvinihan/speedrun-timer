import { useMemo } from "react";
import { useLatestRunSegmentsQuery } from "./useLatestRunSegmentsQuery";

export const useRunSegments = () => {
  const { data: runSegmentsResponse } = useLatestRunSegmentsQuery();

  return useMemo(
    () => runSegmentsResponse?.latestRunSegments ?? [],
    [runSegmentsResponse?.latestRunSegments]
  );
};
