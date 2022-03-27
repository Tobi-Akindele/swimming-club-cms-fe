import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styled from 'styled-components';
import { openRequest } from '../../apiRequests';
import { loginFailure, loginStart, loginSuccess } from '../../redux/loginRedux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router';

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  background: linear-gradient(rgba(255, 255, 255, 0), rgba(255, 255, 255, 0.7)),
    url('https://i.ibb.co/WBp0VSQ/login-unsplash.jpg') center;
  background-size: cover;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Wrapper = styled.div`
  width: 20%;
  padding: 20px;
  background-color: white;
`;

const Logo = styled.img`
  width: 100%;
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: 300;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const Input = styled.input`
  flex: 1;
  min-width: 40%;
  margin: 10px 0px;
  padding: 10px;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: end;
`;

const Button = styled.button`
  width: 40%;
  border: none;
  padding: 15px 20px;
  background-color: #79a5d9;
  color: white;
  cursor: pointer;
  margin-bottom: 10px;
  &:disabled {
    cursor: not-allowed;
  }
`;

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const { isFetching } = useSelector((state) => state.login);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    dispatch(loginStart());
    openRequest
      .post('/login', { username, password })
      .then((res) => {
        dispatch(loginSuccess(res?.data));
        navigate('/dashboard', { replace: true });
      })
      .catch((err) => {
        let message = err.response?.data?.message
          ? err.response?.data?.message
          : err.message;
        toast.error(message);
        dispatch(loginFailure());
      });
  };

  return (
    <>
      <Container>
        <ToastContainer
          position='top-center'
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={true}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
        <Wrapper>
          <Logo
            src='https://i.ibb.co/pKZGTHf/logo.png'
            alt='swimming-club-logo'
          />
          <Title>LOGIN</Title>
          <Form>
            <Input
              placeholder='username'
              onChange={(e) => setUsername(e.target.value)}
            />
            <Input
              placeholder='password'
              type='password'
              onChange={(e) => setPassword(e.target.value)}
            />
            <ButtonContainer>
              {!isFetching && <Button onClick={handleLogin}>LOGIN</Button>}
              {isFetching && (
                <Button onClick={handleLogin} disabled>
                  LOADING <FontAwesomeIcon icon={faSpinner} spin />
                </Button>
              )}
            </ButtonContainer>
          </Form>
        </Wrapper>
      </Container>
    </>
  );
};

export default Login;
