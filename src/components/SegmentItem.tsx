import { SegmentRow } from "../types/SegmentRow";
import { Name, SegmentDiv } from "../styles/Segments";
import { getDisplayTime } from "../helpers";
import { useRunSegments } from "../hooks/useRunSegments";
import { useRunId } from "../hooks/useRunId";
import { useCurrentSegmentId } from "../hooks/useCurrentSegmentId";

type Props = {
  segment: SegmentRow;
};

export const SegmentItem = ({ segment }: Props) => {
  const { name, id } = segment;

  const runId = useRunId();
  const runSegments = useRunSegments();
  const currentRunSegmentId = useCurrentSegmentId();
  const thisRunSegment = runSegments.find(
    (runSegment) => runSegment.runId === runId && runSegment.segmentId === id
  );

  const isActive = currentRunSegmentId === id;
  const shouldCollapse = !thisRunSegment?.isCompleted && !isActive;

  return (
    <SegmentDiv isActive={isActive} shouldCollapse={shouldCollapse}>
      <Name>{name}</Name>
      <div>{getDisplayTime(thisRunSegment?.segmentTime)}</div>
    </SegmentDiv>
  );
};
