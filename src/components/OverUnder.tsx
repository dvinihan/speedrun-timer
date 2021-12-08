import { getDisplayTime } from "../helpers";
import styled from "styled-components";
import { useRunSegments } from "../hooks/useRunSegments";
import { useRunId } from "../hooks/useRunId";
import { useQuery } from "react-query";
import { BestSegmentResponse } from "../../pages/api/bestSegment";
import axios from "axios";

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
  const runSegments = useRunSegments();
  const thisRunSegment = runSegments.find(
    (runSegment) =>
      runSegment.runId === runId && runSegment.segmentId === segmentId
  );
  const { data } = useQuery<BestSegmentResponse>(
    ["bestSegment", segmentId],
    async () => {
      const { data } = await axios.get(
        `/api/bestSegment?segmentId=${segmentId}&currentRunId=${runId}`
      );
      return data;
    }
  );
  const { bestSegmentTime } = data ?? {};

  if (!thisRunSegment || !bestSegmentTime) {
    return null;
  }

  const diff = thisRunSegment?.segmentTime - bestSegmentTime;
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
