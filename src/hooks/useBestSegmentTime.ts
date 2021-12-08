import axios from "axios";
import { useQuery } from "react-query";
import { BestSegmentResponse } from "../../pages/api/bestSegment";
import { useCurrentSegmentId } from "./useCurrentSegmentId";
import { useRunId } from "./useRunId";

export const useBestSegmentTime = () => {
  const currentSegmentId = useCurrentSegmentId();
  const currentRunId = useRunId();

  const { data } = useQuery<BestSegmentResponse>(
    ["bestSegment", currentSegmentId],
    async () => {
      const { data } = await axios.get(
        `/api/bestSegment?segmentId=${currentSegmentId}&currentRunId=${currentRunId}`
      );
      return data;
    }
  );

  return data?.bestSegmentTime;
};
