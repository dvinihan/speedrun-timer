import type { NextPage } from "next";
import styled from "styled-components";
import { Stopwatch } from "../src/components/Stopwatch";
import { EditSegments } from "../src/components/EditSegments";
import { DisplaySegments } from "../src/components/DisplaySegments";

const FlexDiv = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

const Container = styled.div`
  margin: 20px;
`;

const SegmentsFlexItem = styled.div`
  flex: 1;
  min-width: 240px;
  margin-bottom: 40px;
`;

const StopwatchFlexItem = styled.div`
  flex: 1;
  min-width: 240px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Home: NextPage = () => {
  return (
    <Container>
      <h1>SMO Speedrun Timer</h1>
      <h3>Segments:</h3>
      <FlexDiv>
        <SegmentsFlexItem>
          <DisplaySegments />
          <EditSegments />
        </SegmentsFlexItem>
        <StopwatchFlexItem>
          <Stopwatch />
        </StopwatchFlexItem>
      </FlexDiv>
    </Container>
  );
};

export default Home;
