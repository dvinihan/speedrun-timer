import { getDisplayTime } from "../helpers";
import styled from "styled-components";
import { SegmentTimes } from "../helpers/server";

const Container = styled.div<{ color: string }>`
  font-weight: 500;
  margin-right: 30px;
  color: ${(props) => props.color};
`;

type Props = {
  currentTime: number;
  segmentTimes?: SegmentTimes;
};

export const OverUnder = ({ currentTime, segmentTimes }: Props) => {
  if (!segmentTimes) {
    return null;
  }

  const diff = currentTime - segmentTimes.bestPastTime;
  const absoluteValueDiff = Math.abs(diff);
  const operator = diff > 0 ? "+" : "-";
  const tenSecondsMS = 10 * 1000;
  const color =
    diff <= -1 * tenSecondsMS ? "yellow" : diff < 0 ? "green" : "red";

  return (
    <Container color={color}>
      {operator}
      {getDisplayTime(absoluteValueDiff)}
    </Container>
  );
};
