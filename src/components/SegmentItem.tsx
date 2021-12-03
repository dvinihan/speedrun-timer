import { Segment } from "../types/Segment";
import { Name, SegmentDiv } from "../styles/Segments";

type Props = {
  segment: Segment;
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
