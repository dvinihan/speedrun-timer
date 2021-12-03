import { ChangeEvent, useState } from "react";
import { SegmentRow } from "../types/SegmentRow";
import styled from "styled-components";
import { useMutation } from "react-query";
import axios from "axios";
import ReactModal from "react-modal";
import { MediumButton } from "../styles/Buttons";
import { Name, NameInput, SegmentDiv } from "../styles/Segments";

ReactModal.setAppElement("#__next");

const FlexDiv = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
  margin-bottom: 10px;
`;

type Props = {
  isNew?: boolean;
  onSave: () => void;
  segment: SegmentRow;
};

export const EditSegmentItem = ({ isNew = false, onSave, segment }: Props) => {
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
      <SegmentDiv>
        {showEdit ? (
          <>
            <NameInput onChange={handleEdit} value={name} />
            <MediumButton onClick={() => performSave()}>Save</MediumButton>
            {!isNew && (
              <MediumButton onClick={handleDelete}>Delete</MediumButton>
            )}
          </>
        ) : (
          <>
            <Name>{name}</Name>
            <MediumButton onClick={() => setShowEdit(true)}>Edit</MediumButton>
          </>
        )}
      </SegmentDiv>
      <ReactModal
        isOpen={showDeleteModal}
        onAfterClose={() => setShowDeleteModal(false)}
      >
        <FlexDiv>
          Are you sure you want to delete the &quot;{initialName}&quot; segment?
          <MediumButton onClick={() => performDelete()}>Yes</MediumButton>
          <MediumButton onClick={() => setShowDeleteModal(false)}>
            No!
          </MediumButton>
        </FlexDiv>
      </ReactModal>
    </>
  );
};
