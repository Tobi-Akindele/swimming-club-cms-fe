import { Form, Formik } from 'formik';
import React from 'react';
import { toast, ToastContainer } from 'react-toastify';
import styled from 'styled-components';
import Sidebar from '../../components/sidebar/Sidebar';
import Topbar from '../../components/topbar/Topbar';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import {
  createClubFailure,
  createClubStart,
  createClubSuccess,
} from '../../redux/clubRedux';
import { openRequest } from '../../apiRequests';
import TextField from '../../components/formComponents/TextField';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { setAuthToken } from '../../utils';
import DataListInput from '../../components/formComponents/DataListInput';

const Container = styled.div`
  display: flex;
  margin-top: 5px;
`;

const CreateClubContainer = styled.div`
  flex: 4;
  padding: 15px;
`;

const ClubUpdate = styled.div`
  flex: 2;
  width: 35%;
  padding: 20px;
  -webkit-box-shadow: 0px 0px 15px -10px rgba(0, 0, 0, 0.75);
  box-shadow: 0px 0px 15px -10px rgba(0, 0, 0, 0.75);
  margin: auto;
`;

const CreateClubTitle = styled.span`
  font-size: 24px;
  font-weight: 600;
`;

const ClubUpdateContainer = styled.div`
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

const CreateClub = () => {
  const currentUser = useSelector((state) => state?.login?.currentUser);
  const { isFetching: isCreatingClub } = useSelector((state) => state?.club);
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
        await openRequest.get('/club/name', config);
        return createError({ path, message: eMessage });
      } catch (error) {
        return true;
      }
    });
  }

  Yup.addMethod(Yup.mixed, 'isUniqueName', isUniqueName);
  const validate = Yup.object({
    name: Yup.string()
      .min(2, 'Too short')
      .isUniqueName('Role is taken')
      .required('Club name is required'),
    coachId: Yup.string()
      .min(3, 'Please enter at least 3 characters')
      .required('Coach is required'),
  });

  const loadOptions = async (inputText, callback) => {
    let config = {
      headers: {
        username: inputText,
        userType: 'coach',
      },
    };
    try {
      const response = await openRequest.get('/users/search/type', config);
      const json = await response.data;

      callback(
        json.map((item) => ({
          label: `${item.username} (${item.firstName} ${item.lastName})`,
          value: item._id,
        }))
      );
    } catch (error) {}
  };

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
        <CreateClubContainer>
          <ClubUpdate>
            <CreateClubTitle>Create Club</CreateClubTitle>
            <ClubUpdateContainer>
              <Formik
                initialValues={{ name: '', coachId: '' }}
                validationSchema={validate}
                onSubmit={(values, { resetForm }) => {
                  dispatch(createClubStart());
                  openRequest
                    .post(
                      '/club',
                      values,
                      setAuthToken(currentUser.accessToken)
                    )
                    .then((result) => {
                      resetForm({});
                      dispatch(createClubSuccess(result.data));
                      toast.success('Club created successfully');
                    })
                    .catch((err) => {
                      let message = err.response?.data?.message
                        ? err.response?.data?.message
                        : err.message;
                      toast.error(message);
                      dispatch(createClubFailure());
                    });
                }}
              >
                {(formik) => (
                  <Form>
                    {console.log(formik.values)}
                    <TextField
                      name='name'
                      type='text'
                      placeholder='New Club'
                      label='Name'
                    />
                    <DataListInput
                      value={formik.values.coachId}
                      name='coachId'
                      type='text'
                      placeholder='Search Coach'
                      label='Coach'
                      onChange={formik.setFieldValue}
                      onBlur={formik.setFieldTouched}
                      loadOptions={loadOptions}
                      error={formik.errors.coachId}
                      touched={formik.touched.coachId}
                    />
                    <ButtonContainer>
                      <ButtonUpdate
                        type='submit'
                        disabled={
                          !formik.dirty || !formik.isValid || isCreatingClub
                        }
                      >
                        SUBMIT{' '}
                        {isCreatingClub && (
                          <FontAwesomeIcon icon={faSpinner} spin />
                        )}
                      </ButtonUpdate>
                    </ButtonContainer>
                  </Form>
                )}
              </Formik>
            </ClubUpdateContainer>
          </ClubUpdate>
        </CreateClubContainer>
      </Container>
    </>
  );
};

export default CreateClub;
