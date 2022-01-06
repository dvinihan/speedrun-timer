import { getDisplayTime } from "../helpers";
import styled from "styled-components";
import { useRunsData } from "../hooks/useRunsData";
import { sumBy } from "lodash";
import { useMemo } from "react";

const Container = styled.div`
  margin-top: 30px;
`;

export const Stats = () => {
  const { bestOverallTime, latestRunSegments, segmentTimesList } =
    useRunsData();

  const sumOfBestSegments = useMemo(
    () =>
      sumBy(segmentTimesList, (s) => {
        const latestRunSegment = latestRunSegments.find(
          (r) => r.segmentId === s.segmentId
        );
        return latestRunSegment?.isCompleted
          ? Math.min(latestRunSegment.segmentTime, s.bestPastTime)
          : s.bestPastTime;
      }),
    [latestRunSegments, segmentTimesList]
  );

  const bestPossibleTime = useMemo(
    () =>
      segmentTimesList.reduce((totalTime, segmentTimes) => {
        const runSegment = latestRunSegments.find(
          (r) => r.segmentId === segmentTimes.segmentId
        );

        const newTime = !runSegment?.isCompleted
          ? // if not yet completed in current run, use best time
            segmentTimes.bestPastTime
          : // if completed in current run, use actual time
            runSegment.segmentTime;

        return totalTime + newTime;
      }, 0),
    [latestRunSegments, segmentTimesList]
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
