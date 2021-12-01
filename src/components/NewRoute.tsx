import { ChangeEvent, useState } from "react";
import { Segment } from "../types/Segment";
import { useMutation } from "react-query";
import axios from "axios";
import Modal from "react-modal";
import styles from "../styles/NewRoute.module.css";

type Props = {
  id: number;
  onClose: () => void;
};

Modal.setAppElement("#__next");

const inputIdPrefix = "new-route-segment-id-";

export const NewRoute = ({ id, onClose }: Props) => {
  const [error, setError] = useState("");
  const [routeName, setRouteName] = useState("");
  const [segments, setSegments] = useState([{ id: 1, name: "" }]);

  const { mutate } = useMutation(
    async () => {
      const namedSegments = segments.filter((segment) => segment.name);
      await axios.post("/api/addRoute", {
        name: routeName,
        segments: namedSegments,
      });
    },
    {
      onSuccess: () => {
        onClose();
      },
    }
  );

  const handleRouteNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setError("");
    setRouteName(e.target.value);
  };

  const handleAddSegment = () => {
    setSegments((existingSegments: Segment[]) => [
      ...existingSegments,
      { id, name: "" },
    ]);
  };

  const handleEditSegmentName = (e: ChangeEvent<HTMLInputElement>) => {
    const idString = e.target.id;
    const splitIdString = idString.split(inputIdPrefix)[1];
    const idNumber = parseInt(splitIdString);

    setSegments((existingSegments) =>
      existingSegments.map((segment) =>
        segment.id === idNumber ? { ...segment, name: e.target.value } : segment
      )
    );
  };

  const handleSave = () => {
    if (!routeName) {
      setError("Route Name is required");
    } else {
      mutate();
    }
  };

  return (
    <Modal isOpen onRequestClose={onClose}>
      <div>
        <div className={styles.marginBottom}>
          <div className={styles.title}>Route Name</div>
          <input onChange={handleRouteNameChange} value={routeName} />
        </div>
        <div className={styles.title}>Route Segments</div>
        <div>
          {segments.map(({ id, name }, index) => (
            <input
              className={`${styles.block} ${styles.smallMarginBottom}`}
              key={`${id}-${name}-${index}`}
              id={`${inputIdPrefix}${id}`}
              onChange={handleEditSegmentName}
              value={name}
            />
          ))}
          <button
            className={`${styles.smallButton} ${styles.block}`}
            onClick={handleAddSegment}
          >
            Add new segment
          </button>
          <button
            className={`${styles.smallButton} ${styles.block}`}
            onClick={handleSave}
          >
            Save
          </button>
        </div>
      </div>
      {error && <div className={styles.error}>{error}</div>}
    </Modal>
  );
};
