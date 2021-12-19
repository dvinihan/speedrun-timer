import { getDisplayTime } from "../helpers";
import styled from "styled-components";
import { useRunId } from "../hooks/useRunId";
import { useRunsData } from "../hooks/useRunsData";

const Container = styled.div<{ color: string }>`
  font-weight: 500;
  margin-right: 30px;
  color: ${(props) => props.color};
`;

type Props = {
  segmentId: number;
};

export const OverUnder = ({ segmentId }: Props) => {
  const runId = useRunId();
  const { latestRunSegments, overUnders } = useRunsData();
  const thisRunSegment = latestRunSegments.find(
    (runSegment) =>
      runSegment.runId === runId && runSegment.segmentId === segmentId
  );

  if (!thisRunSegment) {
    return null;
  }

  const diff =
    overUnders.find(
      (overUnder) => overUnder.segmentId === thisRunSegment.segmentId
    )?.time ?? 0;
  const absoluteValueDiff = Math.abs(diff);
  const operator = diff > 0 ? "+" : "-";
  const tenSecondsMS = 10 * 1000;
  const color =
    diff <= -1 * tenSecondsMS ? "yellow" : diff < 0 ? "green" : "red";

  return (
    <Container color={color}>
      {operator}
      {getDisplayTime(absoluteValueDiff)}
    </Container>
  );
};
