import { SegmentRow } from "../types/SegmentRow";
import { Name, SegmentDiv } from "../styles/Segments";

type Props = {
  segment: SegmentRow;
};

export const SegmentItem = ({ segment }: Props) => {
  const { name } = segment;

  return (
    <SegmentDiv>
      <Name>{name}</Name>
      <div>---time---</div>
    </SegmentDiv>
  );
};
