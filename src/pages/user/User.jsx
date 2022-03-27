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
  faUpload,
  faPerson,
  faCheck,
  faTriangleExclamation,
} from '@fortawesome/free-solid-svg-icons';
import moment from 'moment';
import { format } from 'timeago.js';
import { calculateAge } from '../../utils';

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

const UserUpdateForm = styled.form`
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
`;

const UserUpdateLeft = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  width: 80%;
`;

const UserUpdateItem = styled.div`
  display: flex;
  flex-direction: column;
  margin: 10px;
`;

const UserUpdateItemLabel = styled.label`
  margin-bottom: 5px;
  font-size: 14px;
`;

const UserUpdateItemInput = styled.input`
  border: none;
  width: 250px;
  height: 30px;
  border-bottom: 1px solid gray;
`;

const UserUpdateRight = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const UserUpdateUpload = styled.div`
  display: flex;
  align-items: center;
`;

const UserUpdateImg = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 10px;
  object-fit: cover;
  margin-right: 20px;
`;

const userUpdateIcon = {
  cursor: 'pointer',
};

const ButtonUpdate = styled.button`
  border: none;
  padding: 10px;
  background-color: #79a5d9;
  color: white;
  font-weight: 600;
  cursor: pointer;
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
              <UserUpdateForm>
                <UserUpdateLeft>
                  <UserUpdateItem>
                    <UserUpdateItemLabel>Username</UserUpdateItemLabel>
                    <UserUpdateItemInput
                      name='username'
                      type='text'
                      placeholder={user.username}
                    />
                  </UserUpdateItem>
                  <UserUpdateItem>
                    <UserUpdateItemLabel>Email</UserUpdateItemLabel>
                    <UserUpdateItemInput
                      name='email'
                      type='email'
                      placeholder={user.email}
                    />
                  </UserUpdateItem>
                  <UserUpdateItem>
                    <UserUpdateItemLabel>First Name</UserUpdateItemLabel>
                    <UserUpdateItemInput
                      name='firstName'
                      type='text'
                      placeholder={user.firstName}
                    />
                  </UserUpdateItem>
                  <UserUpdateItem>
                    <UserUpdateItemLabel>Last Name</UserUpdateItemLabel>
                    <UserUpdateItemInput
                      name='lastName'
                      type='text'
                      placeholder={user.lastName}
                    />
                  </UserUpdateItem>
                  <UserUpdateItem>
                    <UserUpdateItemLabel>Middle Name</UserUpdateItemLabel>
                    <UserUpdateItemInput
                      name='middleName'
                      type='text'
                      placeholder={
                        user.middleName ? user.middleName : 'Middle Name'
                      }
                    />
                  </UserUpdateItem>
                  <UserUpdateItem>
                    <UserUpdateItemLabel>Date of Birth</UserUpdateItemLabel>
                    <UserUpdateItemInput
                      name='dateOfBirth'
                      type='date'
                      defaultValue={
                        new Date(user.dateOfBirth).toISOString().split('T')[0]
                      }
                    />
                  </UserUpdateItem>
                </UserUpdateLeft>

                <UserUpdateRight>
                  <UserUpdateUpload>
                    <UserUpdateImg
                      src={
                        user.image ||
                        'https://crowd-literature.eu/wp-content/uploads/2015/01/no-avatar.gif'
                      }
                      alt='user picture upload'
                    />
                    <label htmlFor='file'>
                      <FontAwesomeIcon icon={faUpload} style={userUpdateIcon} />
                    </label>
                    <input
                      type='file'
                      id='file'
                      accept='image/png, image/jpeg, image/jpg'
                      style={{ display: 'none' }}
                    />
                  </UserUpdateUpload>
                  <ButtonUpdate>Update</ButtonUpdate>
                </UserUpdateRight>
              </UserUpdateForm>
            </UserUpdate>
          </UserShowContainer>
        </UserContainer>
      </Container>
    </>
  );
};

export default User;
