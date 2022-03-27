import React from 'react';
import { useSelector } from 'react-redux';
import './topbar.css';

const Topbar = ({wMessage}) => {
  const { currentUser } = useSelector((state) => state.login);
  return (
    <div className='topbar'>
      <div className='topbarWrapper'>
        <div className='topLeft'>
          <span className='logo'>Swimming Club CMS</span>
        </div>
        {wMessage && (
          <div className='topRight'>
            <div className='topbarIconContainer'>
              {currentUser && 'Welcome, ' + currentUser.username}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default Topbar;
