import type { NextPage } from "next";
import styled from "styled-components";
import { Stopwatch } from "../src/components/Stopwatch";
import { EditSegmentList } from "../src/components/EditSegmentList";
import { SegmentList } from "../src/components/SegmentList";
import { Stats } from "../src/components/Stats";

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
  flex-direction: column;
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
          <SegmentList />
          <EditSegmentList />
        </SegmentsFlexItem>
        <StopwatchFlexItem>
          <Stopwatch />
          <Stats />
        </StopwatchFlexItem>
      </FlexDiv>
    </Container>
  );
};

export default Home;
