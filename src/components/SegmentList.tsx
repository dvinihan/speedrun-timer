import axios from "axios";
import { useQuery } from "react-query";
import { useAppContext } from "../context/AppContext";
import { MediumButton } from "../styles/Buttons";
import { Segment } from "../types/Segment";
import { SegmentItem } from "./SegmentItem";

export const SegmentList = () => {
  const { showEditSegments, setShowEditSegments } = useAppContext()!;

  const { data: segments = [] } = useQuery("segments", async () => {
    const { data } = await axios.get("/api/segments");
    return data;
  });

  if (showEditSegments) return null;

  return (
    <>
      <div>
        {segments.map((segment: Segment, index: number) => (
          <SegmentItem key={`${segment.name}-${index}`} segment={segment} />
        ))}
      </div>
      <MediumButton onClick={() => setShowEditSegments(true)}>
        Edit Route
      </MediumButton>
    </>
  );
};
