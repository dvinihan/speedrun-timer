import type { NextPage } from "next";
import { useState } from "react";
import { useQuery } from "react-query";
import axios from "axios";
import { Route } from "../src/types/Route";
import { NewRoute } from "../src/components/NewRoute";
import styles from "../src/styles/index.module.css";

const Home: NextPage = () => {
  const [showCreateNewRoute, setShowCreateNewRoute] = useState(false);

  const handleOpenCreateNewRoute = () => setShowCreateNewRoute(true);
  const handleCloseCreateNewRoute = () => {
    refetch();
    setShowCreateNewRoute(false);
  };

  const handleOpenEditRoute = () => {};

  const { data: routes = [], refetch } = useQuery("routes", async () => {
    const { data } = await axios.get("/api/routes");
    return data;
  });
  const maxId = routes.reduce(
    (max: number, route: Route) => Math.max(route.id, max),
    1
  );

  return (
    <div className={styles.container}>
      <div>
        <h4>Routes</h4>
        {routes.map(({ name }: Route, index: number) => (
          <div className={styles.flex} key={`${name}-${index}`}>
            <div className={styles.marginRight}>{name}</div>
            <button onClick={handleOpenEditRoute}>Edit</button>
          </div>
        ))}
        <button className={styles.marginTop} onClick={handleOpenCreateNewRoute}>
          Create new route
        </button>
      </div>
      {showCreateNewRoute && (
        <NewRoute id={maxId + 1} onClose={handleCloseCreateNewRoute} />
      )}
    </div>
  );
};

export default Home;
