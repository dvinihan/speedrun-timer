import { useMemo } from "react";
import { useRunSegmentsQuery } from "./useRunSegmentsQuery";

export const useRunSegments = () => {
  const { data: runSegmentsResponse } = useRunSegmentsQuery();

  return useMemo(
    () => runSegmentsResponse?.runSegments ?? [],
    [runSegmentsResponse?.runSegments]
  );
};
