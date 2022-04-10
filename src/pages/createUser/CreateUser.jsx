import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast, ToastContainer } from 'react-toastify';
import styled from 'styled-components';
import { openRequest } from '../../apiRequests';
import Sidebar from '../../components/sidebar/Sidebar';
import Topbar from '../../components/topbar/Topbar';
import {
  registerUserFailure,
  registerUserStart,
  registerUserSuccess,
} from '../../redux/userRedux';
import * as Yup from 'yup';
import { Form, Formik } from 'formik';
import TextField from '../../components/formComponents/TextField';
import { addMethod } from 'yup';
import Radio from '../../components/formComponents/Radio';
import Select from '../../components/formComponents/Select';
import {
  getUserTypesFailure,
  getUserTypesStart,
  getUserTypesSuccess,
} from '../../redux/userTypeRedux';
import { adminOptions, genderOptions, setAuthToken } from '../../utils';
import {
  getRolesFailure,
  getRolesStart,
  getRolesSuccess,
} from '../../redux/roleRedux';
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from 'firebase/storage';
import app from '../../firebase';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

const Container = styled.div`
  display: flex;
  margin-top: 5px;
`;

const CreateUserContainer = styled.div`
  flex: 4;
  padding: 15px;
`;

const UserUpdate = styled.div`
  flex: 2;
  width: 75%;
  padding: 20px;
  -webkit-box-shadow: 0px 0px 15px -10px rgba(0, 0, 0, 0.75);
  box-shadow: 0px 0px 15px -10px rgba(0, 0, 0, 0.75);
  /* margin-left: 20px; */
  margin: auto;
`;

const UserUpdateTitle = styled.span`
  font-size: 24px;
  font-weight: 600;
`;

const UserUpdateContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 20px;
`;

const UserUpdateLeft = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
`;

const UserUpdateRight = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 20px;
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

const RegContainer = styled.div`
  display: flex;
  justify-content: center;
  margin: 10px;
`;

const CreateUser = () => {
  const [file, setFile] = useState(null);
  const currentUser = useSelector((state) => state?.login?.currentUser);
  const { userTypes, isFetching: isFetchingUserTypes } = useSelector(
    (state) => state?.userType
  );
  const { roles, isFetching: isFetchingRoles } = useSelector(
    (state) => state?.role
  );
  const { isFetching: isCreatingUser } = useSelector((state) => state?.user);
  const dispatch = useDispatch();

  function isUniqueUsername(eMessage) {
    return this.test('isUniqueUsername', async function (value) {
      const { path, createError } = this;
      if (!value) {
        return true;
      }
      if (value?.length < 3) {
        return true;
      }
      let config = {
        headers: {
          Authorization: `Bearer ${currentUser.accessToken}`,
          username: value,
        },
      };
      try {
        await openRequest.get('/user/username', config);
        return createError({ path, message: eMessage });
      } catch (error) {
        return true;
      }
    });
  }

  function isUniqueEmail(eMessage) {
    return this.test('isUniqueEmail', async function (value) {
      const { path, createError } = this;
      if (!value) {
        return true;
      }
      if (
        !value.match(/^\w+([.-]?\w+)+@\w+([.:]?\w+)+(\.[a-zA-Z0-9]{2,3})+$/)
      ) {
        return true;
      }
      let config = {
        headers: {
          Authorization: `Bearer ${currentUser.accessToken}`,
          email: value,
        },
      };
      try {
        await openRequest.get('/user/email', config);
        return createError({ path, message: eMessage });
      } catch (error) {
        return true;
      }
    });
  }

  addMethod(Yup.mixed, 'isUniqueUsername', isUniqueUsername);
  addMethod(Yup.mixed, 'isUniqueEmail', isUniqueEmail);

  const validate = Yup.object({
    username: Yup.string()
      .min(3, 'Too short')
      .matches(/^[a-zA-Z0-9_.]+$/, 'Username provided is invalid')
      .isUniqueUsername('Username is taken')
      .required('Username is required'),
    email: Yup.string()
      .email('Email provided is invalid')
      .isUniqueEmail('Email is taken')
      .required('Email is required'),
    firstName: Yup.string()
      .min(2, 'Too short')
      .max(40, 'Too long')
      .required('First name is required'),
    lastName: Yup.string()
      .min(2, 'Too short')
      .max(40, 'Too long')
      .required('Last name is required'),
    dateOfBirth: Yup.string().required('Date of Birth is required'),
    isAdmin: Yup.bool().required('Required'),
    userTypeId: Yup.string().required('Required'),
    roleId: Yup.string().required('Required'),
    gender: Yup.string().required('Required'),
  });

  useEffect(() => {
    //User types
    dispatch(getUserTypesStart());
    openRequest
      .get('/user-types', setAuthToken(currentUser.accessToken))
      .then((result) => {
        dispatch(getUserTypesSuccess(result.data));
      })
      .catch((err) => {
        dispatch(getUserTypesFailure());
      });
  }, [dispatch, currentUser]);

  useEffect(() => {
    dispatch(getRolesStart());
    openRequest
      .get('/roles', setAuthToken(currentUser.accessToken))
      .then((result) => {
        dispatch(getRolesSuccess(result.data));
      })
      .catch((err) => {
        dispatch(getRolesFailure());
      });
  }, [dispatch, currentUser]);

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
        <CreateUserContainer>
          <UserUpdate>
            <UserUpdateTitle>User Registration</UserUpdateTitle>
            <UserUpdateContainer>
              <Formik
                initialValues={{
                  username: '',
                  email: '',
                  firstName: '',
                  lastName: '',
                  middleName: '',
                  dateOfBirth: '',
                  phoneNumber: '',
                  address: '',
                  isAdmin: '',
                  userTypeId: '',
                  roleId: '',
                  gender: '',
                }}
                validationSchema={validate}
                onSubmit={(values, { resetForm }) => {
                  const fileName = new Date().getTime() + file.name;
                  const storage = getStorage(app);
                  const storageRef = ref(storage, fileName);
                  const uploadTask = uploadBytesResumable(storageRef, file);
                  uploadTask.on(
                    'state_changed',
                    (snapshot) => {},
                    (err) => {
                      console.log(err);
                    },
                    () => {
                      getDownloadURL(uploadTask.snapshot.ref).then(
                        (downloadURL) => {
                          const user = {
                            ...values,
                            image: downloadURL,
                            admin: Boolean(values.admin),
                          };
                          dispatch(registerUserStart());
                          openRequest
                            .post(
                              '/signup',
                              user,
                              setAuthToken(currentUser.accessToken)
                            )
                            .then((result) => {
                              resetForm({});
                              dispatch(registerUserSuccess(result.data));
                              toast.success('Registration successful');
                            })
                            .catch((err) => {
                              let message = err.response?.data?.message
                                ? err.response?.data?.message
                                : err.message;
                              toast.error(message);
                              dispatch(registerUserFailure());
                            });
                        }
                      );
                    }
                  );
                }}
              >
                {(formik) => (
                  <Form>
                    {/* Top */}
                    <UserUpdateRight>
                      <TextField
                        name='file'
                        type='file'
                        label='Image'
                        accept='image/png, image/jpeg, image/jpg'
                        onChange={(e) => setFile(e.target.files[0])}
                      />
                    </UserUpdateRight>

                    {/* Bottom */}
                    <UserUpdateLeft>
                      <Select
                        label='User Type'
                        name='userTypeId'
                        options={userTypes}
                        loading={isFetchingUserTypes}
                        width='350px'
                      />
                      <Select
                        label='User Role'
                        name='roleId'
                        options={roles}
                        loading={isFetchingRoles}
                        width='350px'
                      />
                      <TextField
                        name='username'
                        type='text'
                        placeholder='john.doe123'
                        label='Username'
                        width='350px'
                      />
                      <TextField
                        name='email'
                        type='email'
                        placeholder='john.doe@example.com'
                        label='Email'
                        width='350px'
                      />
                      <TextField
                        name='firstName'
                        type='text'
                        placeholder='John'
                        label='First Name'
                        width='350px'
                      />
                      <TextField
                        name='lastName'
                        type='text'
                        placeholder='Doe'
                        label='Last Name'
                        width='350px'
                      />
                      <TextField
                        name='middleName'
                        type='text'
                        placeholder='Smith'
                        label='Middle Name'
                        width='350px'
                      />
                      <TextField
                        name='dateOfBirth'
                        type='date'
                        label='Date of Birth'
                        width='350px'
                      />
                      <TextField
                        name='phoneNumber'
                        type='text'
                        placeholder='+447123456789'
                        label='Phone Number'
                        width='350px'
                      />
                      <TextField
                        name='address'
                        type='text'
                        placeholder='1, Fake st, Fake Town, AQ8 9QT | UK'
                        label='Address'
                        width='350px'
                      />
                      <Radio
                        label='Admin'
                        name='isAdmin'
                        options={adminOptions}
                        width='350px'
                      />
                      <Radio
                        label='Gender'
                        name='gender'
                        options={genderOptions}
                        width='350px'
                      />
                    </UserUpdateLeft>
                    <RegContainer>
                      <ButtonUpdate
                        type='submit'
                        disabled={
                          !formik.dirty || !formik.isValid || isCreatingUser
                        }
                      >
                        REGISTER{' '}
                        {isCreatingUser && (
                          <FontAwesomeIcon icon={faSpinner} spin />
                        )}
                      </ButtonUpdate>
                    </RegContainer>
                  </Form>
                )}
              </Formik>
            </UserUpdateContainer>
          </UserUpdate>
        </CreateUserContainer>
      </Container>
    </>
  );
};

export default CreateUser;
