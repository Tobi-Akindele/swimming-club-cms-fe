import { Form, Formik } from 'formik';
import React from 'react';
import { toast, ToastContainer } from 'react-toastify';
import styled from 'styled-components';
import TextField from '../../components/formComponents/TextField';
import * as Yup from 'yup';
import { useLocation, useNavigate } from 'react-router';
import { useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { useDispatch } from 'react-redux';
import {
  setPasswordFailure,
  setPasswordStart,
  setPasswordSuccess,
} from '../../redux/loginRedux';
import { openRequest } from '../../apiRequests';

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  background: linear-gradient(rgba(255, 255, 255, 0), rgba(255, 255, 255, 0.7)),
    url('https://i.ibb.co/swBhFS6/maksym-unsplash.jpg') center;
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

const FormFieldContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 20px;
  align-items: center;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: end;
  width: 100%;
`;

const Button = styled.button`
  width: 40%;
  border: none;
  padding: 15px 20px;
  background-color: #79a5d9;
  color: white;
  cursor: pointer;
  margin: 15px 0px;
  &:disabled {
    cursor: not-allowed;
  }
`;

const SetPassword = () => {
  const location = useLocation();
  const activationCode = location.pathname.split('/')[2];
  const { isFetching: loading } = useSelector((state) => state.login);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const validate = Yup.object({
    password: Yup.string()
      .min(8, 'Password must be at least 8 characters')
      .required('Password is required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Password must match')
      .required('Confirm password is required'),
  });

  return (
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
        <Title>SET PASSWORD</Title>
        <Formik
          initialValues={{
            password: '',
            confirmPassword: '',
          }}
          validationSchema={validate}
          onSubmit={(values) => {
            const setPassword = {
              ...values,
              activationCode: activationCode,
            };
            dispatch(setPasswordStart());
            openRequest
              .post('/set/password', setPassword)
              .then((result) => {
                dispatch(setPasswordSuccess(result.data));
                setTimeout(() => {
                  navigate('/', { replace: true });
                }, 4000);
                toast.success(result.data?.message);
              })
              .catch((err) => {
                let message = err.response?.data?.message
                  ? err.response?.data?.message
                  : err.message;
                toast.error(message);
                dispatch(setPasswordFailure());
              });
          }}
        >
          {(formik) => (
            <Form>
              <FormFieldContainer>
                <TextField
                  name='password'
                  type='password'
                  placeholder='Password'
                  label='Password'
                />
                <TextField
                  name='confirmPassword'
                  type='password'
                  placeholder='Confirm Password'
                  label='Confirm Password'
                />
                <ButtonContainer>
                  <Button
                    type='submit'
                    disabled={!formik.dirty || !formik.isValid}
                  >
                    SUBMIT{' '}
                    {loading && <FontAwesomeIcon icon={faSpinner} spin />}
                  </Button>
                </ButtonContainer>
              </FormFieldContainer>
            </Form>
          )}
        </Formik>
      </Wrapper>
    </Container>
  );
};

export default SetPassword;
