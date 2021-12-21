import axios, { AxiosResponse } from "axios";
import { sumBy } from "lodash";
import { NextApiRequest } from "next";
import { useQuery } from "react-query";
import { RunsApiResponse } from "../../pages/api/runs";
import { RUNS_QUERY_KEY } from "../constants";
import { useAppContext } from "../context/AppContext";

interface RunsData extends RunsApiResponse {
  refetchRuns: () => void;
}

export const useRunsData = () => {
  const { runningTime, setRunningTime, runType } = useAppContext()!;

  const { data, refetch } = useQuery<RunsApiResponse>(
    [RUNS_QUERY_KEY, runType],
    async () => {
      const { data } = await axios.get<
        NextApiRequest,
        AxiosResponse<RunsApiResponse>
      >(`/api/runs?runType=${runType}`);
      return data;
    },
    {
      onSuccess: ({ latestRunSegments }) => {
        if (!runningTime) {
          const totalTime = sumBy(latestRunSegments, (r) => r.segmentTime);
          setRunningTime(totalTime);
        }
      },
      refetchOnMount: false,
    }
  );
  return ({ ...data, refetchRuns: refetch } ?? {}) as RunsData;
};
