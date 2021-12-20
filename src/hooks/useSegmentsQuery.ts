import axios from "axios";
import { useQuery } from "react-query";
import { useAppContext } from "../context/AppContext";
import { SegmentRow } from "../types/SegmentRow";

export const useSegmentsQuery = () => {
  const { runType } = useAppContext()!;
  return useQuery<SegmentRow[]>("segments", async () => {
    const { data } = await axios.get(`/api/segments?runType=${runType}`);
    return data;
  });
};
