import { SegmentRow } from "../types/SegmentRow";
import { Name, SegmentDiv } from "../styles/Segments";
import { useAppContext } from "../context/AppContext";
import { useQuery } from "react-query";
import { Run } from "../types/Run";
import axios from "axios";
import { getDisplayTime } from "../helpers";

type Props = {
  segment: SegmentRow;
};

export const SegmentItem = ({ segment }: Props) => {
  const { name, id } = segment;

  const { currentSegmentId, runId } = useAppContext()!;

  const { data: runs = [] } = useQuery<Run[]>("runs", async () => {
    const { data } = await axios.get("/api/runs");
    return data;
  });

  const currentRun = runs.find((r) => r.id === runId);
  const currentRunSegment = currentRun?.segments.find((s) => s.id === id);

  return (
    <SegmentDiv isActive={id === currentSegmentId}>
      <Name>{name}</Name>
      <div>{getDisplayTime(currentRunSegment?.segmentTime)}</div>
    </SegmentDiv>
  );
};
