import React from 'react';
import { Search } from '@material-ui/icons';

import './SearchInput.css';

const SearchInput = () => {
  return (
    <div className="">
      <Search />
      <input type="text" placeholder="Search for friends and their photos and videos" />
    </div>
  );
};

export default SearchInput;