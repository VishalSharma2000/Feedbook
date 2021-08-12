import React from 'react';

const IconWithNotifCnt = ({ icon, count }) => {
  return (
    <div>
      <span>{icon}</span>
      <span>{count}</span>
    </div>
  );
};

export default IconWithNotifCnt;