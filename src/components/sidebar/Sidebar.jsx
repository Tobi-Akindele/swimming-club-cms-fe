import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHouseChimney,
  faRightToBracket,
  faMedal,
  faUsers,
  faIdBadge,
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
                />
                Home
              </SidebarListItem>
            </Link>
            <Link to='/competition' className='link'>
              <SidebarListItem>
                <FontAwesomeIcon style={sidebarIconStyles} icon={faMedal} />
                Competitions
              </SidebarListItem>
            </Link>
          </SidebarList>
        </SidebarMenu>
        {/* User mgt */}
        <SidebarMenu>
          <SidebarTitle>User Management</SidebarTitle>
          <SidebarList>
            <Link to='/users' className='link'>
              <SidebarListItem>
                <FontAwesomeIcon style={sidebarIconStyles} icon={faUsers} />
                Users
              </SidebarListItem>
            </Link>
            <Link to='/user-types' className='link'>
              <SidebarListItem>
                <FontAwesomeIcon style={sidebarIconStyles} icon={faIdBadge} />
                Users Types
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
