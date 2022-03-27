import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ErrorMessage, Field } from 'formik';
import React from 'react';
import styled from 'styled-components';

const UserUpdateItem = styled.div`
  display: flex;
  flex-direction: column;
  margin: 10px;
  width: 350px;
`;

const Label = styled.label``;

const selectStyle = {
  height: '35px',
  borderRadius: '5px',
  marginTop: '5px',
};

const Select = (props) => {
  const { label, name, options, loading, ...others } = props;
  return (
    <UserUpdateItem>
      <Label htmlFor={name}>{label}</Label>
      <Field
        as='select'
        style={selectStyle}
        id={name}
        name={name}
        {...others}
        disabled={loading}
      >
        <option key={0} value={''} disabled={true}>
          {'Select an option'}
        </option>
        {options &&
          options.map((option) => {
            return (
              <option
                key={option._id}
                value={option._id}
                disabled={!option.assignable}
              >
                {option.name}
              </option>
            );
          })}
      </Field>
      <ErrorMessage component='UserUpdateItem' name={name} className='error' />
      {loading && <FontAwesomeIcon icon={faSpinner} spin />}
    </UserUpdateItem>
  );
};

export default Select;
