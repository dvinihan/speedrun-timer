import { useAppContext } from "../context/AppContext";
import { useSegments } from "../hooks/useSegments";
import { MediumButton } from "../styles/Buttons";
import { SegmentRow } from "../types/SegmentRow";
import { SegmentItem } from "./SegmentItem";

export const SegmentList = () => {
  const { showEditSegments, setShowEditSegments } = useAppContext()!;

  const segments = useSegments();

  if (showEditSegments) return null;

  return (
    <>
      <div>
        {segments.map((segment: SegmentRow, index: number) => (
          <SegmentItem key={`${segment.name}-${index}`} segment={segment} />
        ))}
      </div>
      <MediumButton onClick={() => setShowEditSegments(true)}>
        Edit Route
      </MediumButton>
    </>
  );
};
