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
        <IconWithNotifCnt icon={<Person />} count={5} />
        <IconWithNotifCnt icon={<Chat />} count={5} />
        <IconWithNotifCnt icon={<Notifications />} count={5} />

        <img src="/assets/images/profile_1.jpg" alt="profile_img" width="50" height="50" />
      </div>

    </div>
  );
};

export default NavBar;