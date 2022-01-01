import { getDisplayTime } from "../helpers";
import styled from "styled-components";
import { useRunsData } from "../hooks/useRunsData";
import { sumBy } from "lodash";
import { useMemo } from "react";

const Container = styled.div`
  margin-top: 30px;
`;

export const Stats = () => {
  const { bestPossibleTime, bestSegmentTimes, bestOverallTime } = useRunsData();

  const sumOfBestSegments = useMemo(
    () => sumBy(bestSegmentTimes, (r) => r.time),
    [bestSegmentTimes]
  );

  return (
    <Container>
      <div>Best overall: {getDisplayTime(bestOverallTime)}</div>
      <div>
        Best possible for current run: {getDisplayTime(bestPossibleTime)}
      </div>
      <div>Sum of best segments: {getDisplayTime(sumOfBestSegments)}</div>
    </Container>
  );
};
