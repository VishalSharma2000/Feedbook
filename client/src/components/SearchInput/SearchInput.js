import React from 'react';
import { Search } from '@material-ui/icons';

import './SearchInput.css';

const SearchInput = (props) => {
  return (
    <div className="container" {...props}>
      <Search className="searchIcon" />
      <input type="text" className="searchInput" placeholder="Search for friends and their photos and videos" />
    </div>
  );
};

export default SearchInput;