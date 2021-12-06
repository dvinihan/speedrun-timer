import styled from "styled-components";

export const SegmentDiv = styled.div<{
  shouldCollapse?: boolean;
  isActive?: boolean;
}>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
  margin-bottom: 10px;
  padding: 10px;
  height: ${(props) => (props.shouldCollapse ? "20px" : "64px")};
  border: ${(props) => (props.isActive ? "5px solid black" : "initial")};
  background-color: ${(props: { isActive?: boolean }) =>
    props.isActive ? "lightblue" : "lightgray"};
`;

export const Name = styled.div`
  margin-right: 10px;
  font-size: large;
`;

export const NameInput = styled.input`
  margin-right: 10px;
  font-size: medium;
  width: 100%;
`;
