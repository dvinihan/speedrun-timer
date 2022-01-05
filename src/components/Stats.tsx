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
    () => sumBy(segmentTimesList, (r) => r.bestPastTime),
    [segmentTimesList]
  );

  const bestPossibleTime = useMemo(
    () =>
      segmentTimesList.reduce((totalTime, segmentTimes) => {
        const runSegment = latestRunSegments.find(
          (r) => r.segmentId === segmentTimes.segmentId
        );

        const newTime =
          !runSegment || !runSegment.isCompleted
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
      <div>SOBS: {getDisplayTime(sumOfBestSegments)}</div>
    </Container>
  );
};
