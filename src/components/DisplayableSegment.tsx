import { Segment } from "../types/Segment";
import styled from "styled-components";
import { Name, SegmentDiv } from "../styles/Segments";

type Props = {
  isNew?: boolean;
  segment: Segment;
};

export const DisplayableSegment = ({ segment }: Props) => {
  const { name } = segment;

  return (
    <SegmentDiv>
      <Name>{name}</Name>
      <div>---time---</div>
    </SegmentDiv>
  );
};
