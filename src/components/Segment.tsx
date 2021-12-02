import { ChangeEvent, useState } from "react";
import { Segment } from "../types/Segment";
import styled from "styled-components";
import { useMutation } from "react-query";
import axios from "axios";
import ReactModal from "react-modal";

ReactModal.setAppElement("#__next");

const FlexDiv = styled.div`
  display: flex;
  align-items: center;
  margin-top: 10px;
  margin-bottom: 10px;
`;

const Name = styled.div`
  margin-right: 10px;
`;
const NameInput = styled.input`
  margin-right: 10px;
`;

const MarginButton = styled.button`
  margin-right: 5px;
  margin-left: 5px;
`;

type Props = {
  isNew?: boolean;
  onSave: () => void;
  segment: Segment;
};

export const SegmentComponent = ({ isNew = false, onSave, segment }: Props) => {
  const { id, name: initialName } = segment;

  const [name, setName] = useState(initialName);
  const [showEdit, setShowEdit] = useState(isNew);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const { mutate: performSave } = useMutation(
    async () => {
      if (name) {
        await axios.post("/api/saveSegment", { ...segment, name });
      }
    },
    {
      onSuccess: () => {
        onSave();
        setShowEdit(false);
      },
    }
  );
  const { mutate: performDelete } = useMutation(
    async () => {
      await axios.delete(`/api/deleteSegment?id=${id}`);
    },
    {
      onSuccess: () => {
        onSave();
        setShowEdit(false);
      },
    }
  );

  const handleEdit = (e: ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleDelete = () => {
    setShowDeleteModal(true);
  };

  return (
    <>
      <FlexDiv>
        {showEdit ? (
          <>
            <NameInput onChange={handleEdit} value={name} />
            <MarginButton onClick={() => performSave()}>Done</MarginButton>
            {!isNew && (
              <MarginButton onClick={handleDelete}>Delete</MarginButton>
            )}
          </>
        ) : (
          <>
            <Name>{name}</Name>
            <MarginButton onClick={() => setShowEdit(true)}>Edit</MarginButton>
          </>
        )}
      </FlexDiv>
      <ReactModal
        isOpen={showDeleteModal}
        onAfterClose={() => setShowDeleteModal(false)}
      >
        <FlexDiv>
          Are you sure you want to delete the &quot;{initialName}&quot; segment?
          <MarginButton onClick={() => performDelete()}>Yes</MarginButton>
          <MarginButton onClick={() => setShowDeleteModal(false)}>
            No!
          </MarginButton>
        </FlexDiv>
      </ReactModal>
    </>
  );
};
