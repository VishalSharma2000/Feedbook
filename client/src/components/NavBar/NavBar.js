import React from 'react';
import { Person, Chat, Notifications } from '@material-ui/icons';

import SearchInput from '../SearchInput/SearchInput';
import IconWithNotifCnt from '../IconWithNotifCnt/IconWithNotifCnt';

const NavBar = () => {
  return (
    <div>
      <span>Feedbook</span>

      <SearchInput />

      <div>
        <IconWithNotifCnt icon={<Person />} count={5} />
        <IconWithNotifCnt icon={<Chat />} count={5} />
        <IconWithNotifCnt icon={<Notifications />} count={5} />
      </div>

      <img src="/assets/images/profile_1.jpg" alt="profile_img" width="50" height="50" />
    </div>
  );
};

export default NavBar;