import axios from "axios";
import { useQuery } from "react-query";
import { getDisplayTime } from "../helpers";
import styled from "styled-components";
import { useRunId } from "../hooks/useRunId";
import { useCurrentSegmentId } from "../hooks/useCurrentSegmentId";

const Container = styled.div`
  margin-top: 30px;
`;

export const Stats = () => {
  const currentRunId = useRunId();
  const currentSegmentId = useCurrentSegmentId();

  const { data: sobs } = useQuery("sobs", async () => {
    const { data } = await axios.get("/api/sobs");
    return data;
  });
  const { sumOfBestSegmentsTime } = sobs ?? {};

  const { data: bestPossible } = useQuery("bestPossible", async () => {
    const { data } = await axios.get(
      `/api/bestPossible?currentRunId=${currentRunId}&currentSegmentId=${currentSegmentId}`
    );
    return data;
  });
  const { bestPossibleTime } = bestPossible ?? {};

  return (
    <Container>
      <div>
        Best possible for current run: {getDisplayTime(bestPossibleTime)}
      </div>
      <div>SOBS: {getDisplayTime(sumOfBestSegmentsTime)}</div>
    </Container>
  );
};
