import { SegmentRow } from "../types/SegmentRow";
import {
  BestText,
  BestTimeDiv,
  FlexDiv,
  Name,
  SegmentDiv,
  TimeDiv,
} from "../styles/Segments";
import { getDisplayTime } from "../helpers";
import { useRunSegments } from "../hooks/useRunSegments";
import { useRunId } from "../hooks/useRunId";
import { useCurrentSegmentId } from "../hooks/useCurrentSegmentId";
import { useBestSegmentTime } from "../hooks/useBestSegmentTime";
import { useSegmentTime } from "../hooks/useSegmentTime";
import { OverUnder } from "./OverUnder";
import { useAppContext } from "../context/AppContext";

type Props = {
  segment: SegmentRow;
};

export const SegmentItem = ({ segment }: Props) => {
  const { name, id } = segment;
  const { startedAtTime } = useAppContext()!;

  const runId = useRunId();
  const runSegments = useRunSegments();
  const currentRunSegmentId = useCurrentSegmentId();
  const activeSegmentTime = useSegmentTime();
  const thisRunSegment = runSegments.find(
    (runSegment) => runSegment.runId === runId && runSegment.segmentId === id
  );
  const bestSegmentTime = useBestSegmentTime();

  const isActive = currentRunSegmentId === id;
  const shouldCollapse = !thisRunSegment?.isCompleted && !isActive;
  const timeToShow =
    isActive && startedAtTime ? activeSegmentTime : thisRunSegment?.segmentTime;

  return (
    <SegmentDiv isActive={isActive} shouldCollapse={shouldCollapse}>
      <Name>{name}</Name>
      <FlexDiv>
        {bestSegmentTime && isActive && (
          <BestTimeDiv>
            <BestText>Best</BestText>
            <div>{getDisplayTime(bestSegmentTime)}</div>
          </BestTimeDiv>
        )}
        {thisRunSegment?.isCompleted && <OverUnder segmentId={id} />}
        <TimeDiv>{getDisplayTime(timeToShow)}</TimeDiv>
      </FlexDiv>
    </SegmentDiv>
  );
};
