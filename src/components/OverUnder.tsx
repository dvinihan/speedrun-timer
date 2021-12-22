import { getDisplayTime } from "../helpers";
import styled from "styled-components";
import { useRunsData } from "../hooks/useRunsData";

const Container = styled.div<{ color: string }>`
  font-weight: 500;
  margin-right: 30px;
  color: ${(props) => props.color};
`;

type Props = {
  segmentId: number;
};

export const OverUnder = ({ segmentId }: Props) => {
  const { overUnders } = useRunsData();

  const diff = overUnders.find(
    (overUnder) => overUnder.segmentId === segmentId
  )?.time;

  if (diff === undefined) {
    return null;
  }

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
