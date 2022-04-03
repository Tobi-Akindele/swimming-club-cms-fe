import React from 'react';
import { ErrorMessage, useField } from 'formik';
import styled from 'styled-components';

const UserUpdateItem = styled.div`
  display: flex;
  flex-direction: column;
  margin: 10px;
  width: 350px;
`;

const Label = styled.label``;

const UserUpdateItemInput = styled.input`
  border: none;
  height: 30px;
  width: ${(props) => props.width};
  border-bottom: ${(props) =>
    props.hasError ? '1px solid red' : '1px solid grey'};
`;

const TextField = ({ ...props }) => {
  const [field, meta] = useField(props);

  return (
    <UserUpdateItem>
      <Label>{props.label}</Label>
      <UserUpdateItemInput
        hasError={meta.touched && meta.error ? true : false}
        {...field}
        {...props}
        autoComplete='off'
      />
      <ErrorMessage
        component='UserUpdateItem'
        name={field.name}
        className='error'
      />
    </UserUpdateItem>
  );
};

export default TextField;
