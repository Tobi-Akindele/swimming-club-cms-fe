import {
  faAngleLeft,
  faAt,
  faCalendar,
  faCheck,
  faLocationDot,
  faMarsAndVenus,
  faPenToSquare,
  faPhone,
  faTriangleExclamation,
  faUser,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import moment from 'moment';
import { useLocation, useNavigate } from 'react-router';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { toast, ToastContainer } from 'react-toastify';
import styled from 'styled-components';
import { format } from 'timeago.js';
import { openRequest } from '../../apiRequests';
import UpdateProfileModal from '../../components/modal/UpdateProfileModal';
import Sidebar from '../../components/sidebar/Sidebar';
import Topbar from '../../components/topbar/Topbar';
import WidgetSm from '../../components/widgetSm/WidgetSm';
import { calculateAge, setAuthToken } from '../../utils';

const Container = styled.div`
  display: flex;
  margin-top: 5px;
`;

const ProfileContainer = styled.div`
  flex: 4;
  padding: 0px 20px;
`;

const ProfileTitleContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
`;

const ProfileTitle = styled.h1``;

const ProfileDetailContainer = styled.div`
  flex: 2;
  flex-direction: column;
  padding: 20px;
  -webkit-box-shadow: 0px 0px 15px -10px rgba(0, 0, 0, 0.75);
  box-shadow: 0px 0px 15px -10px rgba(0, 0, 0, 0.75);
`;

const ProfileDetailTitleContainer = styled.div`
  display: flex;
  justify-content: space-between;
`;

const ProfileDetailTitle = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: rgb(175, 170, 170);
`;

const ShowUserInfo = styled.div`
  display: flex;
  align-items: center;
  margin: 10px 0px;
`;

const ShowUserImage = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
`;

const ShowUserTitle = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 20px;
`;

const ShowUserName = styled.span`
  font-weight: 600;
`;

const ShowUserType = styled.span`
  font-weight: 300;
`;

const ProfileDetailInfo = styled.div`
  display: flex;
  align-items: center;
  margin: 20px 0px;
  color: #444;
`;

const ProfileDetailText = styled.span`
  margin-left: 10px;
`;

const userShowIcon = {
  fontSize: '16px !important',
};

const ProfileTopContainer = styled.div`
  display: flex;
`;

const ButtonDelete = styled.button`
  border: none;
  padding: 10px;
  background-color: red;
  margin: 0px 10px;
  cursor: pointer;
  color: white;
  font-size: 15px;
  &:disabled {
    cursor: not-allowed;
  }
`;

const ChildProfile = () => {
  const location = useLocation();
  const userId = location.pathname.split('/')[2];
  const currentUser = useSelector((state) => state.login?.currentUser);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [user, setUser] = useState({});
  const navigate = useNavigate();

  const openUpdateModal = (e) => {
    e.preventDefault();
    setShowUpdateModal((prev) => !prev);
  };

  useEffect(() => {
    openRequest
      .get(`/user/${userId}`, setAuthToken(currentUser?.accessToken))
      .then((result) => {
        setUser(result.data);
      })
      .catch((err) => {
        let message = err.response?.data?.message
          ? err.response?.data?.message
          : err.message;
        toast.error(message);
      });
  }, [userId, currentUser]);

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
        <ProfileContainer>
          <ProfileTitleContainer>
              <ProfileTitle>Profile</ProfileTitle>
              <ButtonDelete onClick={() => navigate(-1)}>
                <FontAwesomeIcon icon={faAngleLeft} /> Back
              </ButtonDelete>
          </ProfileTitleContainer>

          <ProfileTopContainer>
            <ProfileDetailContainer>
              <ProfileDetailTitleContainer>
                <ProfileDetailTitle>Profile Details</ProfileDetailTitle>
                <FontAwesomeIcon
                  icon={faPenToSquare}
                  title='Edit Profile'
                  fontSize='25px'
                  cursor={user.updatable ? 'pointer' : 'not-allowed'}
                  onClick={user.updatable ? openUpdateModal : null}
                />
              </ProfileDetailTitleContainer>

              <ShowUserInfo>
                <ShowUserImage
                  src={
                    user?.image ||
                    'https://crowd-literature.eu/wp-content/uploads/2015/01/no-avatar.gif'
                  }
                  alt='user picture'
                />
                <ShowUserTitle>
                  <ShowUserName>
                    {user?.firstName} {user?.lastName?.toUpperCase()}{' '}
                    {user.middleName}
                  </ShowUserName>
                  <ShowUserType>
                    {user?.userType?.name?.toUpperCase()}
                  </ShowUserType>
                </ShowUserTitle>
              </ShowUserInfo>

              <ProfileDetailInfo>
                <FontAwesomeIcon
                  icon={faUser}
                  style={userShowIcon}
                  title='username'
                />
                <ProfileDetailText>{user.username}</ProfileDetailText>
              </ProfileDetailInfo>

              <ProfileDetailInfo>
                <FontAwesomeIcon
                  icon={faCalendar}
                  style={userShowIcon}
                  title='date of birth'
                />
                <ProfileDetailText>
                  {moment(user.dateOfBirth).format('MMMM Do YYYY')}{' '}
                  {'(' + calculateAge(user.dateOfBirth) + ' years)'}
                </ProfileDetailText>
              </ProfileDetailInfo>

              <ProfileDetailInfo>
                <FontAwesomeIcon
                  icon={faMarsAndVenus}
                  style={userShowIcon}
                  title='gender'
                />
                <ProfileDetailText>
                  {user.gender ? user.gender : 'Nil'}
                </ProfileDetailText>
              </ProfileDetailInfo>

              <ProfileDetailInfo>
                <FontAwesomeIcon
                  icon={faAt}
                  style={userShowIcon}
                  title='email'
                />
                <ProfileDetailText>{user.email}</ProfileDetailText>
              </ProfileDetailInfo>

              <ProfileDetailInfo>
                <FontAwesomeIcon
                  icon={faPhone}
                  style={userShowIcon}
                  title='phone'
                />
                <ProfileDetailText>
                  {user.phoneNumber ? user.phoneNumber : 'Nil'}
                </ProfileDetailText>
              </ProfileDetailInfo>

              <ProfileDetailInfo>
                <FontAwesomeIcon
                  icon={faLocationDot}
                  style={userShowIcon}
                  title='address'
                />
                <ProfileDetailText>
                  {user.address ? user.address : 'Nil'}
                </ProfileDetailText>
              </ProfileDetailInfo>

              {user?.club?._id?.length ? (
                <ProfileDetailInfo>
                  Club:
                  <ProfileDetailText>{user?.club?.name}</ProfileDetailText>
                </ProfileDetailInfo>
              ) : null}

              <ProfileDetailInfo>
                Joined:
                <ProfileDetailText>{format(user._created)}</ProfileDetailText>
              </ProfileDetailInfo>

              <ProfileDetailInfo>
                Status:
                <ProfileDetailText>
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
                        Verified
                      </>
                    ) : (
                      <>
                        <FontAwesomeIcon
                          icon={faTriangleExclamation}
                          style={{ color: 'red' }}
                        />{' '}
                        Unverified
                      </>
                    )}
                  </span>
                </ProfileDetailText>
              </ProfileDetailInfo>
            </ProfileDetailContainer>

            {user?.parents?.length ? (
              <WidgetSm title='Parents' data={user?.parents} />
            ) : null}
          </ProfileTopContainer>
        </ProfileContainer>

        <UpdateProfileModal
          showModal={showUpdateModal}
          setShowModal={setShowUpdateModal}
          user={user}
        />
      </Container>
    </>
  );
};

export default ChildProfile;
