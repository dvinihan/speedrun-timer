import axios from "axios";
import { useCallback, useState } from "react";
import { useQuery } from "react-query";
import { useAppContext } from "../context/AppContext";
import { MediumButton } from "../styles/Buttons";
import { SegmentRow } from "../types/SegmentRow";
import { EditSegmentItem } from "./EditSegmentItem";

export const EditSegmentList = () => {
  const { showEditSegments, setShowEditSegments } = useAppContext()!;

  const [newSegment, setNewSegment] = useState<SegmentRow | undefined>();

  const { data: segments = [], refetch } = useQuery("segments", async () => {
    const { data } = await axios.get("/api/segments");
    return data;
  });

  const handleAddSegment = useCallback(() => {
    const maxId =
      segments.length > 0
        ? Math.max(...segments.map((segment: SegmentRow) => segment.id))
        : 0;
    setNewSegment({ id: maxId + 1, name: "" });
  }, [segments]);

  const handleSave = useCallback(() => {
    setNewSegment(undefined);
    refetch();
  }, [refetch]);

  if (!showEditSegments) return null;

  return (
    <>
      <div>
        {segments.map((segment: SegmentRow, index: number) => (
          <EditSegmentItem
            key={`${segment.name}-${index}`}
            onSave={refetch}
            segment={segment}
          />
        ))}
        {newSegment && (
          <EditSegmentItem isNew onSave={handleSave} segment={newSegment} />
        )}
      </div>
      <MediumButton onClick={() => setShowEditSegments(false)}>
        Done Editing
      </MediumButton>
      {!newSegment && (
        <MediumButton onClick={handleAddSegment}>Add Segment</MediumButton>
      )}
    </>
  );
};
