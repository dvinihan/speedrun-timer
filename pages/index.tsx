import type { NextPage } from "next";
import { useQuery } from "react-query";
import axios from "axios";
import { Segment } from "../src/types/Segment";
import { SegmentComponent } from "../src/components/Segment";
import styled from "styled-components";
import { useCallback, useState } from "react";

const Container = styled.div`
  margin: 20px;
`;

const Home: NextPage = () => {
  const [newSegment, setNewSegment] = useState<Segment | undefined>();

  const { data: segments = [], refetch } = useQuery("segments", async () => {
    const { data } = await axios.get("/api/segments");
    return data;
  });

  const handleAddSegment = useCallback(() => {
    const maxId =
      segments.length > 0
        ? Math.max(...segments.map((segment: Segment) => segment.id))
        : 0;
    setNewSegment({ id: maxId + 1, name: "" });
  }, [segments]);

  const handleSave = useCallback(() => {
    setNewSegment(undefined);
    refetch();
  }, [refetch]);

  return (
    <Container>
      <h1>SMO Speedrun Timer</h1>
      <h3>Segments:</h3>
      <div>
        {segments.map((segment: Segment, index: number) => (
          <SegmentComponent
            key={`${segment.name}-${index}`}
            onSave={refetch}
            segment={segment}
          />
        ))}
        {newSegment && (
          <SegmentComponent isNew onSave={handleSave} segment={newSegment} />
        )}
      </div>
      {!newSegment && <button onClick={handleAddSegment}>Add Segment</button>}
    </Container>
  );
};

export default Home;
