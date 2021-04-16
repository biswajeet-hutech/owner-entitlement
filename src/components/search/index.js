import React from "react";
import { Button, Input, Tooltip } from 'antd';
import {SearchIcon,strings} from './../../assets';
import "./style.scss";

const Search = ({
  placeHolder=strings.entitlements_search_placeholder,
  onSearch=() => {},
  onChange=() => {},
}) => {
  const [searchText, onSearchTextChange] = React.useState('');
  const handleSearchTextUpdate = (e) => {
    const val = e.target.value;
    e.stopPropagation();
    if (val !== searchText) {
      onSearchTextChange(e.target.value);
      onChange(e.target.value);
      if (!val) {
        onSearch('');
      }
    }
  }

  return (
    <Input
      className="oe-search"
      placeholder={placeHolder}
      onChange={handleSearchTextUpdate}
      onPressEnter={() => onSearch(searchText)}
      allowClear
      suffix={
        <Tooltip title="Click to search">
          <Button icon={<SearchIcon/>} type="text" onClick={() => onSearch(searchText)}/>
        </Tooltip>
      }
    />
  );
}

export default Search;
