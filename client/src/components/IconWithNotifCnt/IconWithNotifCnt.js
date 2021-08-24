import React from 'react';

import "./IconWithNotifCnt.css";

const IconWithNotifCnt = ({ icon, count }) => {
  return (
    <div className="iconNotif__container">
      <span className="iconNotif__badgeIcon">{icon}</span>
      <span className="iconNotif__notifCnt">{count}</span>
    </div>
  );
};

export default IconWithNotifCnt;