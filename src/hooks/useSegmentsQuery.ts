import axios from "axios";
import { useQuery } from "react-query";
import { SEGMENTS_QUERY_KEY } from "../constants";
import { useAppContext } from "../context/AppContext";
import { SegmentRow } from "../types/SegmentRow";

export const useSegmentsQuery = () => {
  const { runType } = useAppContext()!;
  const { data: segments = [], refetch } = useQuery<SegmentRow[]>(
    [SEGMENTS_QUERY_KEY, runType],
    async () => {
      const { data } = await axios.get(`/api/segments?runType=${runType}`);
      return data;
    }
  );

  return {
    segments: segments.sort((a, b) => a.id - b.id),
    refetch,
  };
};
