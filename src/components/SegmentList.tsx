import { useAppContext } from "../context/AppContext";
import { useRunsData } from "../hooks/useRunsData";
import { useSegmentsQuery } from "../hooks/useSegmentsQuery";
import { MediumButton } from "../styles/Buttons";
import { SegmentRow } from "../types/SegmentRow";
import { SegmentItem } from "./SegmentItem";

export const SegmentList = () => {
  const { showEditSegments, setShowEditSegments } = useAppContext()!;

  const { segments } = useSegmentsQuery();
  const { segmentTimesList } = useRunsData();

  if (showEditSegments) return null;

  return (
    <>
      <div>
        {segments
          .sort((a, b) => a.id - b.id)
          .map((segment: SegmentRow, index: number) => {
            const segmentTimes = segmentTimesList.find(
              (s) => s.segmentId === segment.id
            );
            return (
              <SegmentItem
                key={`${segment.name}-${index}`}
                segment={segment}
                segmentTimes={segmentTimes}
              />
            );
          })}
      </div>
      <MediumButton onClick={() => setShowEditSegments(true)}>
        Edit Route
      </MediumButton>
    </>
  );
};
