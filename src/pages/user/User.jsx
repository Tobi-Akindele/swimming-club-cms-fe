import React from 'react';
import { useSelector } from 'react-redux';
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
import { calculateAge } from '../../utils';
import TextField from '../../components/formComponents/TextField';
import { Form, Formik } from 'formik';

const Container = styled.div`
  display: flex;
  margin-top: 5px;
`;

const UserContainer = styled.div`
  flex: 4;
  padding: 20px;
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
  const userId = location.pathname.split('/')[2];
  const user = useSelector((state) =>
    state.user.users.find((user) => user._id === userId)
  );

  return (
    <>
      <Topbar wMessage={false} />
      <Container>
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
                    {user?.firstName} {user?.lastName.toUpperCase()}
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
                  <FontAwesomeIcon /> Status
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
                          width='250px'
                        />
                      </UserUpdateRight>

                      {/* Bottom */}
                      <UserUpdateLeft>
                        <TextField
                          name='username'
                          type='text'
                          placeholder='john.doe123'
                          label='Username'
                        />
                        <TextField
                          name='email'
                          type='email'
                          placeholder='john.doe@example.com'
                          label='Email'
                        />
                        <TextField
                          name='firstName'
                          type='text'
                          placeholder='John'
                          label='First Name'
                        />
                        <TextField
                          name='lastName'
                          type='text'
                          placeholder='Doe'
                          label='Last Name'
                        />
                        <TextField
                          name='middleName'
                          type='text'
                          placeholder='Smith'
                          label='Middle Name'
                        />
                        <TextField
                          name='dateOfBirth'
                          type='date'
                          label='Date of Birth'
                        />
                        <TextField
                          name='phoneNumber'
                          type='text'
                          placeholder='+447123456789'
                          label='Phone Number'
                        />
                        <TextField
                          name='address'
                          type='text'
                          placeholder='1, Fake st, Fake Town, AQ8 9QT | UK'
                          label='Address'
                        />
                      </UserUpdateLeft>
                      <RegContainer>
                        <ButtonUpdate
                          type='submit'
                          disabled={!formik.dirty || !formik.isValid || false}
                        >
                          UPDATE{' '}
                          {false && <FontAwesomeIcon icon={faSpinner} spin />}
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
