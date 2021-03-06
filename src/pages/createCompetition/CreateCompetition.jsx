import { Form, Formik } from 'formik';
import React from 'react';
import { toast, ToastContainer } from 'react-toastify';
import styled from 'styled-components';
import Sidebar from '../../components/sidebar/Sidebar';
import Topbar from '../../components/topbar/Topbar';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { openRequest } from '../../apiRequests';
import TextField from '../../components/formComponents/TextField';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { setAuthToken } from '../../utils';
import {
  createCompetitionsFailure,
  createCompetitionStart,
  createCompetitionSuccess,
} from '../../redux/competitionRedux';

const Container = styled.div`
  display: flex;
  margin-top: 5px;
`;

const CreateRoleContainer = styled.div`
  flex: 4;
  padding: 15px;
`;

const RoleUpdate = styled.div`
  flex: 2;
  width: 50%;
  padding: 20px;
  -webkit-box-shadow: 0px 0px 15px -10px rgba(0, 0, 0, 0.75);
  box-shadow: 0px 0px 15px -10px rgba(0, 0, 0, 0.75);
  margin: auto;
`;

const CreateRoleTitle = styled.span`
  font-size: 24px;
  font-weight: 600;
`;

const RoleUpdateContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 20px;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin: 10px;
`;

const ButtonUpdate = styled.button`
  border: none;
  padding: 10px;
  background-color: #79a5d9;
  color: white;
  font-weight: 600;
  cursor: pointer;
  &:disabled {
    cursor: not-allowed;
  }
`;

const CreateCompetition = () => {
  const currentUser = useSelector((state) => state?.login?.currentUser);
  const { isFetching: isCreating } = useSelector((state) => state.competition);
  const dispatch = useDispatch();

  function isUniqueName(eMessage) {
    return this.test('isUniqueName', async function (value) {
      const { path, createError } = this;
      if (!value || value?.length < 2) {
        return true;
      }
      let config = {
        headers: {
          Authorization: `Bearer ${currentUser.accessToken}`,
          name: value,
        },
      };

      try {
        await openRequest.get('/competition/name', config);
        return createError({ path, message: eMessage });
      } catch (error) {
        return true;
      }
    });
  }

  Yup.addMethod(Yup.mixed, 'isUniqueName', isUniqueName);

  const validate = Yup.object({
    name: Yup.string()
      .min(3, 'Too short')
      .isUniqueName('Name exists')
      .required('Competition name is required'),
    date: Yup.string().required('Competition date is required'),
  });
  return (
    <>
      <Topbar wMessage={false} />
      <Container>
        <ToastContainer
          position='top-center'
          autoClose={2000}
          hideProgressBar={false}
          newestOnTop={true}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
        <Sidebar />
        <CreateRoleContainer>
          <RoleUpdate>
            <CreateRoleTitle>Create Competition</CreateRoleTitle>
            <RoleUpdateContainer>
              <Formik
                initialValues={{ name: '', date: '' }}
                validationSchema={validate}
                onSubmit={(values, { resetForm }) => {
                  dispatch(createCompetitionStart());
                  openRequest
                    .post(
                      '/competition',
                      values,
                      setAuthToken(currentUser.accessToken)
                    )
                    .then((result) => {
                      resetForm({});
                      dispatch(createCompetitionSuccess(result.data));
                      toast.success('Competition created successfully');
                    })
                    .catch((err) => {
                      let message = err.response?.data?.message
                        ? err.response?.data?.message
                        : err.message;
                      toast.error(message);
                      dispatch(createCompetitionsFailure());
                    });
                }}
              >
                {(formik) => (
                  <Form>
                    <TextField
                      name='name'
                      type='text'
                      placeholder='New Competition'
                      label='Name'
                    />
                    <TextField name='date' type='date' label='Date' />
                    <ButtonContainer>
                      <ButtonUpdate
                        type='submit'
                        disabled={
                          !formik.dirty || !formik.isValid || isCreating
                        }
                      >
                        SUBMIT{' '}
                        {isCreating && (
                          <FontAwesomeIcon icon={faSpinner} spin />
                        )}
                      </ButtonUpdate>
                    </ButtonContainer>
                  </Form>
                )}
              </Formik>
            </RoleUpdateContainer>
          </RoleUpdate>
        </CreateRoleContainer>
      </Container>
    </>
  );
};

export default CreateCompetition;
