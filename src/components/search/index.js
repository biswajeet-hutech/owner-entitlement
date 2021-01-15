import React from "react";
import { Button, Input, Tooltip } from 'antd';
// import { SearchOutlined } from '@ant-design/icons';
import {SearchIcon} from './../../assets';
import "./style.scss";

const Search = ({
  placeHolder="Search entitlements",
  onSearch=() => {},
  onChange=() => {},
}) => {
  const [searchText, onSearchTextChange] = React.useState('');
  const handleSearchTextUpdate = (e) => {
    onSearchTextChange(e.target.value);
    onChange(e.target.value);
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
          <Button icon={<SearchIcon/>} type="text" onClick={() => onSearch(searchText)}/>
        </Tooltip>
      }
    />
  );
}

export default Search;
