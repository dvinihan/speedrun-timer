import { getDisplayTime } from "../helpers";
import styled from "styled-components";
import { useRunsData } from "../hooks/useRunsData";

const Container = styled.div`
  margin-top: 30px;
`;

export const Stats = () => {
  const { sumOfBestSegmentsTime, bestPossibleTime, bestOverallTime } =
    useRunsData();

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
