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
import { OverUnder } from "./OverUnder";
import { useAppContext } from "../context/AppContext";
import { useEffect, useMemo, useState } from "react";
import { useCurrentSegmentId } from "../hooks/useCurrentSegmentId";

type Props = {
  segment: SegmentRow;
};

export const SegmentItem = ({ segment }: Props) => {
  const { name, id } = segment;
  const { isRunning, startedAtTime } = useAppContext()!;
  const { bestSegmentTimes = [], latestRunSegments } = useRunsData();
  const currentSegmentId = useCurrentSegmentId();

  const [activeSegmentTime, setActiveSegmentTime] = useState(0);

  const bestSegmentTime = useMemo(
    () => bestSegmentTimes.find((r) => r.segmentId === id)?.time,
    [bestSegmentTimes, id]
  );

  const thisRunSegment = latestRunSegments?.find(
    (runSegment) => runSegment.segmentId === id
  );

  const isActive = currentSegmentId === id;
  const shouldCollapse = !thisRunSegment?.isCompleted && !isActive;
  const timeToShow =
    isActive && startedAtTime ? activeSegmentTime : thisRunSegment?.segmentTime;

  // timer
  useEffect(() => {
    let interval: NodeJS.Timer | undefined;

    if (isRunning && isActive) {
      interval = setInterval(() => {
        setActiveSegmentTime(Date.now() - startedAtTime + activeSegmentTime);
      }, 10);
    } else if (interval) {
      clearInterval(interval);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
    // we can't include runningTime or the timer will tick too quickly
  }, [isActive, isRunning, startedAtTime]);

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
