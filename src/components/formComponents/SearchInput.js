import React from 'react';
import styled from 'styled-components';

const Input = styled.input`
  border: none;
  height: 30px;
  border-bottom: 1px solid grey;
  width: ${(props) => props.width};
`;

const SearchInput = ({ ...props }) => {
  return <Input {...props} />;
};

export default SearchInput;
