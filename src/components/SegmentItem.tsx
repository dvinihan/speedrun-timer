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
import { useRunsData } from "../hooks/useRunsData";
import { useActiveSegmentTime } from "../hooks/useActiveSegmentTime";
import { useAppContext } from "../context/AppContext";
import { useCurrentSegmentId } from "../hooks/useCurrentSegmentId";
import { SegmentTimes } from "../server/helpers";
import { OverUnder } from "./OverUnder";

type Props = {
  segment: SegmentRow;
  segmentTimes?: SegmentTimes;
};

export const SegmentItem = ({ segment, segmentTimes }: Props) => {
  const { name, id } = segment;
  const { bestPastTime } = segmentTimes ?? {};

  const { startedAtTime } = useAppContext()!;
  const { latestRunSegments } = useRunsData();
  const currentSegmentId = useCurrentSegmentId();

  const activeSegmentTime = useActiveSegmentTime();
  const thisRunSegment = latestRunSegments?.find(
    (runSegment) => runSegment.segmentId === id
  );

  const isActive = currentSegmentId === id;
  const shouldCollapse = !thisRunSegment?.isCompleted && !isActive;
  const timeToShow =
    isActive && startedAtTime ? activeSegmentTime : thisRunSegment?.segmentTime;

  return (
    <SegmentDiv isActive={isActive} shouldCollapse={shouldCollapse}>
      <Name>{name}</Name>
      <FlexDiv>
        {bestPastTime && isActive && (
          <BestTimeDiv>
            <BestText>Best</BestText>
            <div>{getDisplayTime(bestPastTime)}</div>
          </BestTimeDiv>
        )}
        {thisRunSegment?.isCompleted && (
          <OverUnder
            currentTime={thisRunSegment?.segmentTime}
            segmentTimes={segmentTimes}
          />
        )}
        <TimeDiv>{getDisplayTime(timeToShow)}</TimeDiv>
      </FlexDiv>
    </SegmentDiv>
  );
};
