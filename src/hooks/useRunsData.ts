import axios, { AxiosResponse } from "axios";
import { NextApiRequest } from "next";
import { useQuery } from "react-query";
import { RunsApiResponse } from "../../pages/api/runs";
import { RUNS_QUERY_KEY } from "../constants";
import { useAppContext } from "../context/AppContext";

interface RunsData extends RunsApiResponse {
  refetchRuns: () => void;
}

export const useRunsData = () => {
  const { runType } = useAppContext()!;

  const { data, refetch } = useQuery<RunsApiResponse>(
    [RUNS_QUERY_KEY, runType],
    async () => {
      const { data } = await axios.get<
        NextApiRequest,
        AxiosResponse<RunsApiResponse>
      >(`/api/runs?runType=${runType}`);
      return data;
    }
  );
  return ({
    latestRunSegments: [],
    segmentTimesList: [],
    ...data,
    refetchRuns: refetch,
  } ?? {}) as RunsData;
};
