import { ErrorMessage, Field } from 'formik';
import React from 'react';
import styled from 'styled-components';

const UserUpdateItem = styled.div`
  display: flex;
  flex-direction: column;
  margin: 10px;
  width: ${(props) => props.width};
`;

const Label = styled.label``;

const RadioLabel = styled.label`
  margin: 5px;
  font-size: 15px;
  color: #555;
`;

const Input = styled.input`
  margin-top: 15px;
`;

const Radio = (props) => {
  const { label, name, options, value, ...others } = props;
  return (
    <UserUpdateItem width={props.width}>
      <Label>{label}</Label>
      <div>
        <Field name={name}>
          {({ field }) => {
            return options.map((option) => {
              return (
                <React.Fragment key={option.key}>
                  <Input
                    type='radio'
                    id={option.value}
                    {...field}
                    {...others}
                    value={option.value}
                    checked={field.value === option.value}
                  />
                  <RadioLabel htmlFor={option.value}>{option.key}</RadioLabel>
                </React.Fragment>
              );
            });
          }}
        </Field>
      </div>
      <ErrorMessage component='UserUpdateItem' name={name} className='error' />
    </UserUpdateItem>
  );
};

export default Radio;
