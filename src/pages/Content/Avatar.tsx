import styled from 'styled-components';

const Avatar = styled.div<{ backColor: string, borderColor: string, shadowColor: string }>`
  width: 32px;
  height: 32px;
  border: 3px solid ${(props) => props.borderColor};
  border-radius: 25px;
  overflow: hidden;
  box-shadow: 0px 0px 10px 0px ${(props) => props.shadowColor};
  box-sizing: content-box;
  background-color: ${(props) => props.backColor};
  z-index: 2;
`;

export default Avatar;