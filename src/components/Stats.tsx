import axios from "axios";
import { useQuery } from "react-query";
import { getDisplayTime } from "../helpers";
import styled from "styled-components";
import { useCurrentSegmentId } from "../hooks/useCurrentSegmentId";
import { StatsApiResponse } from "../../pages/api/stats";

const Container = styled.div`
  margin-top: 30px;
`;

export const Stats = () => {
  const currentSegmentId = useCurrentSegmentId();

  const { data } = useQuery("sobs", async () => {
    const { data } = await axios.get<StatsApiResponse>(
      `/api/stats?currentSegmentId=${currentSegmentId}`
    );
    return data;
  });
  const { sumOfBestSegmentsTime, bestPossibleTime, bestOverallTime } =
    data ?? {};

  return (
    <Container>
      <div>Best overall: {getDisplayTime(bestOverallTime)}</div>
      <div>
        Best possible for current run: {getDisplayTime(bestPossibleTime)}
      </div>
      <div>SOBS: {getDisplayTime(sumOfBestSegmentsTime)}</div>
    </Container>
  );
};
