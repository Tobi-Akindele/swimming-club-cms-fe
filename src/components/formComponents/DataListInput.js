import { ErrorMessage, useField } from 'formik';
import React from 'react';
import styled from 'styled-components';
import AsyncSelect from 'react-select/async';

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin: 10px;
  width: ${(props) => props.width};
`;

const Label = styled.label`
  margin: 5px 0px;
`;

const DataListInput = ({ ...props }) => {
  const [field] = useField(props);

  const handleChange = (value) => {
    props.onChange(props.name, value.value);
  };
  const handleBlur = () => {
    props.onBlur(props.name, true);
  };

  return (
    <InputContainer width={props.width}>
      <Label>{props.label}</Label>

      <AsyncSelect
        isMulti={false}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder={props.placeholder}
        loadOptions={props.loadOptions}
      />

      <ErrorMessage
        component='InputContainer'
        name={field.name}
        className='error'
      />
    </InputContainer>
  );
};

export default DataListInput;
