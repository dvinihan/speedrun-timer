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
import { useRunId } from "../hooks/useRunId";
import { useRunsData } from "../hooks/useRunsData";
import { useActiveSegmentTime } from "../hooks/useActiveSegmentTime";
import { OverUnder } from "./OverUnder";
import { useAppContext } from "../context/AppContext";
import { useMemo } from "react";

type Props = {
  segment: SegmentRow;
};

export const SegmentItem = ({ segment }: Props) => {
  const { name, id } = segment;
  const { startedAtTime } = useAppContext()!;

  const {
    currentSegmentId,
    latestRunSegments,
    bestSegmentTimes = [],
  } = useRunsData();

  const bestSegmentTime = useMemo(() => {
    const timeKey = Object.keys(bestSegmentTimes).find(
      (key) => key === id.toString()
    );
    return bestSegmentTimes[parseInt(timeKey!)];
  }, [bestSegmentTimes, id]);

  const runId = useRunId();
  const activeSegmentTime = useActiveSegmentTime();
  const thisRunSegment = latestRunSegments?.find(
    (runSegment) => runSegment.runId === runId && runSegment.segmentId === id
  );

  const isActive = currentSegmentId === id;
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
            <div>{getDisplayTime(bestSegmentTime.time)}</div>
          </BestTimeDiv>
        )}
        {thisRunSegment?.isCompleted && <OverUnder segmentId={id} />}
        <TimeDiv>{getDisplayTime(timeToShow)}</TimeDiv>
      </FlexDiv>
    </SegmentDiv>
  );
};
