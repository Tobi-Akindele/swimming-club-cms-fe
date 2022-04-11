import React from 'react';
import styled from 'styled-components';
import './switch.css';

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin: 10px;
  width: ${(props) => props.width};
`;

const Label = styled.label``;

const TextLabel = styled.label``;

const Input = styled.input``;

const InputSpan = styled.div``;

const Switch = ({ ...props }) => {
  return (
    <InputContainer>
      <TextLabel style={{ margin: '5px 0px' }}>{props.label}</TextLabel>
      <Input
        checked={props.isOn}
        onChange={props.handleToggle}
        className='switch-checkbox'
        id={props.id}
        type={props.type}
      />
      <Label
        htmlFor={props.id}
        className='switch-label'
        style={{ background: props.isOn && '#06D6A0' }}
      >
        <InputSpan className='switch-button' />
      </Label>
    </InputContainer>
  );
};

export default Switch;
