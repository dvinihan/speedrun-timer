import axios from "axios";
import { useQuery } from "react-query";
import { SegmentRow } from "../types/SegmentRow";

export const useSegmentsQuery = () =>
  useQuery<SegmentRow[]>("segments", async () => {
    const { data } = await axios.get("/api/segments");
    return data;
  });
