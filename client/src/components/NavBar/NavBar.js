import React from 'react';
import { Person, Chat, Notifications } from '@material-ui/icons';

import SearchInput from '../SearchInput/SearchInput';
import IconWithNotifCnt from '../IconWithNotifCnt/IconWithNotifCnt';

import "./NavBar.css";

const NavBar = () => {
  return (
    <div className="navbar__container">
      <span className="navbar__left">Feedbook</span>

      <div className="navbar__middle">
        <SearchInput />
      </div>

      <div className="navbar__right">
        <div className="rightSideIcons">
          <IconWithNotifCnt icon={<Person style={{ fontSize: '22px', color: 'white' }} />} count={5} />
          <IconWithNotifCnt icon={<Chat style={{ fontSize: '22px', color: 'white' }} />} count={5} />
          <IconWithNotifCnt icon={<Notifications style={{ fontSize: '22px', color: 'white' }} />} count={5} />
        </div>

        <img className="profileImage" src="/assets/images/profile_1.jpg" alt="profile_img" />
      </div>

    </div>
  );
};

export default NavBar;