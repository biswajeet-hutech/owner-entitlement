import React from "react";
import { Input, Tooltip } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import "./style.scss";

const Search = ({
  placeHolder="Search entitlements",
  onSearch=() => {}
}) => {
  const [searchText, onSearchTextChange] = React.useState('');
  const handleSearchTextUpdate = (e) => {
    onSearchTextChange(e.target.value);
  }
  const handleSearch = (e) => {
    if (e.keyCode === 13) {
      e.preventDefault();
      if (typeof onSearch === "function") {
        onSearch(searchText);
      }
    }
  }
  return (
    <Input
      className="oe-search"
      placeholder={placeHolder}
      onChange={handleSearchTextUpdate}
      onKeyUp={handleSearch}
      suffix={
        <Tooltip title="Click to search">
          <SearchOutlined onClick={() => onSearch(searchText)} />
        </Tooltip>
      }
    />
  );
}

export default Search;
