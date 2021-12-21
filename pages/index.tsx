import type { NextPage } from "next";
import styled from "styled-components";
import { Stopwatch } from "../src/components/Stopwatch";
import { EditSegmentList } from "../src/components/EditSegmentList";
import { SegmentList } from "../src/components/SegmentList";
import { Stats } from "../src/components/Stats";
import { useEffect } from "react";
import { useAppContext } from "../src/context/AppContext";
import { useRunsData } from "../src/hooks/useRunsData";
import { useSegmentsQuery } from "../src/hooks/useSegmentsQuery";
import { RunType } from "../src/constants";

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
  const {
    setCurrentRunSegments,
    runType,
    setRunType,
    isRunning,
    setRunningTime,
  } = useAppContext()!;
  const { refetchRuns } = useRunsData();
  const { refetch: refetchSegments } = useSegmentsQuery();

  const { latestRunSegments } = useRunsData();

  useEffect(() => {
    setCurrentRunSegments(latestRunSegments);
  }, [latestRunSegments, setCurrentRunSegments]);

  const handleRunTypeSelect = (e: any) => {
    setRunType(e.target.value);
    refetchRuns();
    refetchSegments();
    setRunningTime(0);
  };

  return (
    <Container>
      <h1>SMO Speedrun Timer</h1>
      <select
        defaultValue={runType}
        disabled={isRunning}
        onChange={handleRunTypeSelect}
      >
        <option value={RunType.WORLD_PEACE}>World Peace</option>
        <option value={RunType.ANY_PERCENT}>Any%</option>
      </select>
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
