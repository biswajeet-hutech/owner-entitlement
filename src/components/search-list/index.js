import { List } from "antd/lib/form/Form";
import React from "react";
import { AddIcon, CloseIcon } from "../../assets";
import Search from "../search";
import "./style.scss";


function SearchList(props) {
  const {
    list,
    keyProp="id",
    labelProp="label",
    action="add",
    onItemAdd=() => {},
    onItemRemove=()=>{}
  } = props;
  // console.log(props);
  const [listItems, setListItems] = React.useState([...list]);
  const [searchText, setSearchText] = React.useState("");

  const filterSearch = (searchTxt) => {
    const filteredList = list.filter(item => item.label.includes(searchTxt));
    setSearchText(searchTxt);
    setListItems([...filteredList]);
  }

  const handleIconClick = (id) => {
    // console.log("click");
    if (action === "add") {
      onItemAdd(id);
    } else {
      onItemRemove(id);
    }
  }

  React.useEffect(() => {
    if (list) {
      filterSearch(searchText);
    }
  }, [list]);

  return (
    <div className="oe-search-list">
      <Search placeHolder="" onSearch={filterSearch} />
      <ul>
        {
          listItems.map(item => (
            <li>
              <span>
                {item.label}
              </span>
              <span className="li-item-action" onClick={() => handleIconClick(item.id)}>
                { action === "add" ? <AddIcon /> : <CloseIcon /> }
              </span>
            </li>
          ))
        }
      </ul>
    </div>
  );
}

export default SearchList;
