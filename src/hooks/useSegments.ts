import { useSegmentsQuery } from "./useSegmentsQuery";

export const useSegments = () => {
  const { data: segments = [] } = useSegmentsQuery();
  return segments;
};
