import axios from "axios";
import { useQuery } from "react-query";
import { useAppContext } from "../context/AppContext";
import { MediumButton } from "../styles/Buttons";
import { Segment } from "../types/Segment";
import { DisplayableSegment } from "./DisplayableSegment";

export const DisplaySegments = () => {
  const { isRunning } = useAppContext()!;

  const { data: segments = [] } = useQuery("segments", async () => {
    const { data } = await axios.get("/api/segments");
    return data;
  });

  if (!isRunning) return null;

  return (
    <>
      <div>
        {segments.map((segment: Segment, index: number) => (
          <DisplayableSegment
            key={`${segment.name}-${index}`}
            segment={segment}
          />
        ))}
      </div>
      <MediumButton disabled>Add Segment</MediumButton>
    </>
  );
};
