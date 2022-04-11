import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHouseChimney,
  faRightToBracket,
  faMedal,
  faFingerprint,
  faUserGroup,
  faAddressCard,
  faUserLarge,
  faUsersBetweenLines,
  faPersonSwimming,
} from '@fortawesome/free-solid-svg-icons';
import { useDispatch } from 'react-redux';
import { logoutFailure, logoutSuccess } from '../../redux/loginRedux';
import { useNavigate } from 'react-router';

const SidebarContainer = styled.div`
  flex: 1;
  height: calc(100vh - 50px);
  background-color: rgb(240, 250, 255);
  position: sticky;
  top: 50px;
  border-radius: 10px;
  -webkit-box-shadow: 0px 0px 15px -10px rgba(0, 0, 0, 0.75);
  box-shadow: 0px 0px 15px -10px rgba(0, 0, 0, 0.75);
`;

const SidebarWrapper = styled.div`
  padding: 20px;
  color: #555;
`;

const SidebarMenu = styled.div`
  margin-bottom: 10px;
`;

const SidebarTitle = styled.h3`
  font-size: 13px;
  color: rgb(187, 186, 186);
`;

const SidebarList = styled.ul`
  list-style: none;
  padding: 0px;
`;

const SidebarListItem = styled.li`
  padding: 5px;
  cursor: pointer;
  display: flex;
  align-items: center;
  border-radius: 10px;
  &:active,
  :hover {
    background-color: rgb(217, 236, 238);
  }
`;

const sidebarIconStyles = {
  marginRight: '5px',
  fontSize: '20px !important',
};

const Sidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = (e) => {
    e.preventDefault();
    try {
      dispatch(logoutSuccess());
      setTimeout(() => {
        localStorage.removeItem('persist:root');
      }, 1000);
      navigate('/', { replace: true });
    } catch (error) {
      dispatch(logoutFailure());
    }
  };

  return (
    <SidebarContainer>
      <SidebarWrapper>
        {/* Dashboard */}
        <SidebarMenu>
          <SidebarTitle>Dashboard</SidebarTitle>
          <SidebarList>
            <Link to='/dashboard' className='link'>
              <SidebarListItem>
                <FontAwesomeIcon
                  style={sidebarIconStyles}
                  icon={faHouseChimney}
                  title='Home'
                />
                Home
              </SidebarListItem>
            </Link>
            <Link to='/competitions' className='link'>
              <SidebarListItem>
                <FontAwesomeIcon
                  style={sidebarIconStyles}
                  icon={faMedal}
                  title='Competitions'
                />
                Competitions
              </SidebarListItem>
            </Link>
            <Link to='/clubs' className='link'>
              <SidebarListItem>
                <FontAwesomeIcon
                  style={sidebarIconStyles}
                  icon={faUsersBetweenLines}
                  title='Clubs'
                />
                Clubs
              </SidebarListItem>
            </Link>
            <Link to='/' className='link'>
              <SidebarListItem>
                <FontAwesomeIcon
                  style={sidebarIconStyles}
                  icon={faPersonSwimming}
                  title='Training Data'
                />
                Training Data
              </SidebarListItem>
            </Link>
          </SidebarList>
        </SidebarMenu>
        {/* User mgt */}
        <SidebarMenu>
          <SidebarTitle>User Management</SidebarTitle>
          <SidebarList>
            <Link to='/profile' className='link'>
              <SidebarListItem>
                <FontAwesomeIcon
                  style={sidebarIconStyles}
                  icon={faUserLarge}
                  title='Profile'
                />
                Profile
              </SidebarListItem>
            </Link>
            <Link to='/users' className='link'>
              <SidebarListItem>
                <FontAwesomeIcon
                  style={sidebarIconStyles}
                  icon={faUserGroup}
                  title='Users'
                />
                Users
              </SidebarListItem>
            </Link>
            <Link to='/user-types' className='link'>
              <SidebarListItem>
                <FontAwesomeIcon
                  style={sidebarIconStyles}
                  icon={faAddressCard}
                  title='User Types'
                />
                {` `}
                Users Types
              </SidebarListItem>
            </Link>
            <Link to='/roles' className='link'>
              <SidebarListItem>
                <FontAwesomeIcon
                  style={sidebarIconStyles}
                  icon={faFingerprint}
                  title='Roles'
                />
                {` `}
                Roles
              </SidebarListItem>
            </Link>
          </SidebarList>
        </SidebarMenu>

        <SidebarMenu>
          <SidebarTitle>Exit</SidebarTitle>
          <SidebarList>
            <SidebarListItem onClick={handleLogout}>
              <FontAwesomeIcon
                style={sidebarIconStyles}
                icon={faRightToBracket}
                title='Logout'
              />
              Logout
            </SidebarListItem>
          </SidebarList>
        </SidebarMenu>
      </SidebarWrapper>
    </SidebarContainer>
  );
};

export default Sidebar;
