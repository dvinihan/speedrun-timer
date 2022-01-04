import type { NextApiRequest, NextPage } from "next";
import styled from "styled-components";
import { Stopwatch } from "../src/components/Stopwatch";
import { EditSegmentList } from "../src/components/EditSegmentList";
import { SegmentList } from "../src/components/SegmentList";
import { Stats } from "../src/components/Stats";
import { useEffect } from "react";
import { useAppContext } from "../src/context/AppContext";
import { useRunsData } from "../src/hooks/useRunsData";
import { useSegmentsQuery } from "../src/hooks/useSegmentsQuery";
import { RUNS_QUERY_KEY, RunType } from "../src/constants";
import { dehydrate, QueryClient } from "react-query";
import axios, { AxiosResponse } from "axios";
import { RunsApiResponse } from "./api/runs";

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
  const { runType, setRunType, isRunning, setRunningTime } = useAppContext()!;
  const { refetch: refetchSegments } = useSegmentsQuery();
  const { refetchRuns } = useRunsData();

  useEffect(() => {
    refetchRuns();
  }, [refetchRuns]);

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

export const getServerSideProps = async () => {
  const queryClient = new QueryClient();

  await Promise.all([
    queryClient.prefetchQuery(["segments", RunType.ANY_PERCENT], async () => {
      const { data } = await axios.get(
        `${process.env.BASE_URL}/api/segments?runType=anyPercent`
      );
      return data;
    }),
    queryClient.prefetchQuery(
      [RUNS_QUERY_KEY, RunType.ANY_PERCENT],
      async () => {
        const { data } = await axios.get<
          NextApiRequest,
          AxiosResponse<RunsApiResponse>
        >(`${process.env.BASE_URL}/api/runs?runType=anyPercent`);
        return data;
      }
    ),
  ]);

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
};

export default Home;
