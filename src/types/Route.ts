import { Segment } from "./Segment";

export type Route = {
  id: number;
  name: string;
  segments: Segment[];
};
