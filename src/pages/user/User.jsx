import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router';
import styled from 'styled-components';
import Sidebar from '../../components/sidebar/Sidebar';
import Topbar from '../../components/topbar/Topbar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUser,
  faCalendar,
  faAt,
  faPen,
  faPhone,
  faLocationDot,
  faPerson,
  faCheck,
  faTriangleExclamation,
  faSpinner,
} from '@fortawesome/free-solid-svg-icons';
import moment from 'moment';
import { format } from 'timeago.js';
import { calculateAge, genderOptions, setAuthToken } from '../../utils';
import TextField from '../../components/formComponents/TextField';
import Radio from '../../components/formComponents/Radio';
import { Form, Formik } from 'formik';
import Select from '../../components/formComponents/Select';
import {
  getUserTypesFailure,
  getUserTypesStart,
  getUserTypesSuccess,
} from '../../redux/userTypeRedux';
import { openRequest } from '../../apiRequests';
import {
  getRolesFailure,
  getRolesStart,
  getRolesSuccess,
} from '../../redux/roleRedux';
import * as Yup from 'yup';
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from 'firebase/storage';
import app from '../../firebase';
import { toast, ToastContainer } from 'react-toastify';
import {
  updateUserFailure,
  updateUserStart,
  updateUserSuccess,
} from '../../redux/userRedux';

const Container = styled.div`
  display: flex;
  margin-top: 5px;
`;

const UserContainer = styled.div`
  flex: 4;
  padding: 0px 20px;
`;

const UserTitleContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const UserTitle = styled.h1``;

const UserShowContainer = styled.div`
  display: flex;
  margin-top: 20px;
`;

const UserShow = styled.div`
  flex: 1;
  padding: 20px;
  -webkit-box-shadow: 0px 0px 15px -10px rgba(0, 0, 0, 0.75);
  box-shadow: 0px 0px 15px -10px rgba(0, 0, 0, 0.75);
`;

const UserShowTop = styled.div`
  display: flex;
  align-items: center;
`;

const UserShowImg = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
`;

const UserShowTopTitle = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 20px;
`;

const UserShowUsername = styled.span`
  font-weight: 600;
`;

const UserShowUserType = styled.span`
  font-weight: 300;
`;

const UserShowBottom = styled.div`
  margin-top: 20px;
`;

const UserShowTitle = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: rgb(175, 170, 170);
`;

const UserShowInfo = styled.div`
  display: flex;
  align-items: center;
  margin: 20px 0px;
  color: #444;
`;

const userShowIcon = {
  fontSize: '16px !important',
};

const UserShowInfoTitle = styled.span`
  margin-left: 10px;
`;

const UserUpdate = styled.div`
  flex: 2;
  padding: 20px;
  -webkit-box-shadow: 0px 0px 15px -10px rgba(0, 0, 0, 0.75);
  box-shadow: 0px 0px 15px -10px rgba(0, 0, 0, 0.75);
  margin-left: 20px;
`;

const UserUpdateTitle = styled.span`
  font-size: 24px;
  font-weight: 600;
`;

const UserUpdateLeft = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  width: 80%;
`;

const UserUpdateRight = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
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

const UserUpdateContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 20px;
`;

const RegContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin: 10px;
`;

const User = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.login?.currentUser);
  const userId = location.pathname.split('/')[2];
  const user = useSelector((state) =>
    state.user.users.find((user) => user._id === userId)
  );
  const { userTypes, isFetching: isFetchingUserTypes } = useSelector(
    (state) => state.userType
  );
  const { roles, isFetching: isFetchingRoles } = useSelector(
    (state) => state.role
  );
  const { isFetching: isUpdating } = useSelector((state) => state.user);
  const [file, setFile] = useState(null);

  useEffect(() => {
    //User types
    dispatch(getUserTypesStart());
    openRequest
      .get('/user-types', setAuthToken(currentUser?.accessToken))
      .then((result) => {
        dispatch(getUserTypesSuccess(result.data));
      })
      .catch((err) => {
        dispatch(getUserTypesFailure());
      });
  }, [dispatch, currentUser]);

  useEffect(() => {
    //Roles
    dispatch(getRolesStart());
    openRequest
      .get('/roles', setAuthToken(currentUser?.accessToken))
      .then((result) => {
        dispatch(getRolesSuccess(result.data));
      })
      .catch((err) => {
        dispatch(getRolesFailure());
      });
  }, [dispatch, currentUser]);

  const validate = Yup.object({
    firstName: Yup.string()
      .min(2, 'Too short')
      .max(40, 'Too long')
      .required('First name is required'),
    lastName: Yup.string()
      .min(2, 'Too short')
      .max(40, 'Too long')
      .required('Last name is required'),
    dateOfBirth: Yup.string().required('Date of Birth is required'),
    userTypeId: Yup.string().required('Required'),
    roleId: Yup.string().required('Required'),
    gender: Yup.string().required('Required'),
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
        <UserContainer>
          <UserTitleContainer>
            <UserTitle>User</UserTitle>
          </UserTitleContainer>
          <UserShowContainer>
            <UserShow>
              <UserShowTop>
                <UserShowImg
                  src={
                    user?.image ||
                    'https://crowd-literature.eu/wp-content/uploads/2015/01/no-avatar.gif'
                  }
                  alt='user picture'
                />
                <UserShowTopTitle>
                  <UserShowUsername>
                    {user?.firstName} {user?.lastName.toUpperCase()}{' '}
                    {user.middleName}
                  </UserShowUsername>
                  <UserShowUserType>{user?.userType?.name}</UserShowUserType>
                </UserShowTopTitle>
              </UserShowTop>
              <UserShowBottom>
                <UserShowTitle>User Details</UserShowTitle>
                <UserShowInfo>
                  <FontAwesomeIcon icon={faUser} style={userShowIcon} />
                  <UserShowInfoTitle>{user.username}</UserShowInfoTitle>
                </UserShowInfo>
                <UserShowInfo>
                  <FontAwesomeIcon icon={faCalendar} style={userShowIcon} />
                  <UserShowInfoTitle>
                    {moment(user.dateOfBirth).format('MMMM Do YYYY')}{' '}
                    {'(' + calculateAge(user.dateOfBirth) + ' years)'}
                  </UserShowInfoTitle>
                </UserShowInfo>
                <UserShowInfo>
                  <FontAwesomeIcon icon={faPerson} style={userShowIcon} />
                  <UserShowInfoTitle>{user.gender}</UserShowInfoTitle>
                </UserShowInfo>

                <UserShowTitle>Contact Details</UserShowTitle>
                <UserShowInfo>
                  <FontAwesomeIcon icon={faAt} style={userShowIcon} />
                  <UserShowInfoTitle>{user.email}</UserShowInfoTitle>
                </UserShowInfo>
                <UserShowInfo>
                  <FontAwesomeIcon icon={faPhone} style={userShowIcon} />
                  <UserShowInfoTitle>{user.phoneNumber}</UserShowInfoTitle>
                </UserShowInfo>
                <UserShowInfo>
                  <FontAwesomeIcon icon={faLocationDot} style={userShowIcon} />
                  <UserShowInfoTitle>{user.address}</UserShowInfoTitle>
                </UserShowInfo>

                <UserShowTitle>Registered</UserShowTitle>
                <UserShowInfo>
                  <FontAwesomeIcon icon={faPen} style={userShowIcon} />
                  <UserShowInfoTitle>
                    {format(user._created)}{' '}
                  </UserShowInfoTitle>
                </UserShowInfo>
                <UserShowInfo>
                  Status
                  <UserShowInfoTitle>
                    <span
                      style={{
                        border: `1px solid ${user.active ? 'green' : 'red'}`,
                        width: '70px',
                        textAlign: 'center',
                        borderRadius: '10px',
                        padding: '10px',
                        cursor: 'pointer',
                      }}
                    >
                      {user.active ? (
                        <>
                          <FontAwesomeIcon
                            icon={faCheck}
                            style={{ color: '#3bb077' }}
                          />{' '}
                          Active
                        </>
                      ) : (
                        <>
                          <FontAwesomeIcon
                            icon={faTriangleExclamation}
                            style={{ color: 'red' }}
                          />{' '}
                          Inactive
                        </>
                      )}
                    </span>
                  </UserShowInfoTitle>
                </UserShowInfo>
              </UserShowBottom>
            </UserShow>

            <UserUpdate>
              <UserUpdateTitle>Edit</UserUpdateTitle>
              <UserUpdateContainer>
                <Formik
                  initialValues={{
                    firstName: user.firstName,
                    lastName: user.lastName,
                    middleName: user.middleName,
                    dateOfBirth: user.dateOfBirth.split('T')[0],
                    phoneNumber: user.phoneNumber,
                    address: user.address,
                    userTypeId: user.userType._id,
                    roleId: user.role._id,
                    gender: user.gender,
                  }}
                  validationSchema={validate}
                  onSubmit={(values, { resetForm }) => {
                    let userUpdate = {};
                    if (file) {
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
                              userUpdate = {
                                image: downloadURL,
                                ...values,
                              };
                            }
                          );
                        }
                      );
                    } else {
                      userUpdate = {
                        image: user.image,
                        ...values,
                      };
                    }
                    dispatch(updateUserStart());
                    openRequest
                      .put(
                        `/user/update/${userId}`,
                        userUpdate,
                        setAuthToken(currentUser.accessToken)
                      )
                      .then((result) => {
                        // resetForm({});
                        dispatch(updateUserSuccess(result.data));
                        toast.success('Update successful');
                      })
                      .catch((err) => {
                        let message = err.response?.data?.message
                          ? err.response?.data?.message
                          : err.message;
                        toast.error(message);
                        dispatch(updateUserFailure());
                      });
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
                          value={user.userType._id}
                        />
                        <Select
                          label='User Role'
                          name='roleId'
                          options={roles}
                          loading={isFetchingRoles}
                          value={user.role._id}
                        />
                        <TextField
                          name='firstName'
                          type='text'
                          placeholder={user.firstName}
                          label='First Name'
                        />
                        <TextField
                          name='lastName'
                          type='text'
                          placeholder={user.lastName}
                          label='Last Name'
                        />
                        <TextField
                          name='middleName'
                          type='text'
                          placeholder={user.middleName}
                          label='Middle Name'
                        />
                        <TextField
                          name='dateOfBirth'
                          type='date'
                          label='Date of Birth'
                          value={user.dateOfBirth.split('T')[0]}
                        />
                        <TextField
                          name='phoneNumber'
                          type='text'
                          placeholder={user.phoneNumber}
                          label='Phone Number'
                        />
                        <TextField
                          name='address'
                          type='text'
                          placeholder={user.address}
                          label='Address'
                        />
                        <Radio
                          label='Gender'
                          name='gender'
                          options={genderOptions}
                          value={user.gender}
                        />
                      </UserUpdateLeft>
                      <RegContainer>
                        <ButtonUpdate
                          type='submit'
                          disabled={
                            !formik.dirty || !formik.isValid || isUpdating
                          }
                        >
                          UPDATE{' '}
                          {isUpdating && (
                            <FontAwesomeIcon icon={faSpinner} spin />
                          )}
                        </ButtonUpdate>
                      </RegContainer>
                    </Form>
                  )}
                </Formik>
              </UserUpdateContainer>
            </UserUpdate>
          </UserShowContainer>
        </UserContainer>
      </Container>
    </>
  );
};

export default User;
