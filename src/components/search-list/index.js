import { List, Spin, Tooltip } from "antd";
import React from "react";
import Button from "../button";
import Search from "../search";
import "./style.scss";

// const pageLimit = 10;

function SearchList(props) {
  const {
    list,
    action="add",
    onItemAdd=() => {},
    onItemRemove=()=>{},
    onSearch=()=>{},
    loadingList
  } = props;
  const [listItems, setListItems] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  const handleIconClick = (id, actionType) => {
    if (actionType === "add") {
      onItemAdd(id);
    } else {
      onItemRemove(id);
    }
  }

  React.useEffect(() => {
    if (list) {
      setListItems(list);
    }
  }, [list]);

  React.useEffect(() => {
    setLoading(!!loadingList);
  }, [loadingList]);

  return (
    <div className="oe-search-list">
      <Search placeHolder="Search users" onChange={val => onSearch(val)} />
        <div className="oe-infinite-container">
          {loading ? (
              <div className="demo-loading-container">
                <Spin />
              </div>
            ) : (
            <List
              dataSource={listItems}
              renderItem={item => (
                <List.Item key={item.id} onClick={e => e.stopPropagation()}>
                  <List.Item.Meta
                    title={item.label}
                  />
                  <div>
                    {
                      action !== "view" && (
                        <Tooltip title={item.action === "add" ? "Add Member" : "Remove Member"} placement="right">
                          <Button type="primary" size="small" onClick={() => handleIconClick(item.id, item.action)}>
                            {
                              item.action === "add" ? "Add" : "Remove"
                            }
                          </Button>
                        </Tooltip>
                        )
                      }
                  </div>
                </List.Item>
              )}
            >
            </List>
            )}
        </div>
    </div>
  );
}

export default SearchList;
