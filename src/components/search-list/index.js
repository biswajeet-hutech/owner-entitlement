import { List, Spin, Tooltip } from "antd";
import React from "react";
import InfiniteScroll from 'react-infinite-scroller';
import Button from "../button";
import Search from "../search";
import "./style.scss";

const pageLimit = 10;

function SearchList(props) {
  const {
    list,
    action="add",
    onItemAdd=() => {},
    onItemRemove=()=>{},
    loadingList
  } = props;
  const [listItems, setListItems] = React.useState([]);
  const [pagination, setPagination] = React.useState({
    page: 1
  });
  const [loading, setLoading] = React.useState(false);
  const [hasMore, setHasMore] = React.useState(true);
  const [searchText, setSearchText] = React.useState("");

  const getListData = ({ data: dataList, page }) => {
    const limit = pageLimit;
    const startIndex = limit * (page - 1);
    const endIndex = limit * page;
    const response = dataList.slice(startIndex, endIndex);
    return response;
  }

  const filterSearch = (searchTxt, dataList = [...list]) => {
    const filteredList = dataList.filter(item => ((item.searchString || '').toLowerCase()).includes(searchTxt.toLowerCase()));
    const trimmedList = getListData({ data: [...(filteredList || [])], page: 1 });
    setSearchText(searchTxt);
    setListItems(JSON.parse(JSON.stringify(trimmedList)));
    setLoading(false);
    setHasMore(true);
  }

  const handleIconClick = (id, actionType) => {
    if (actionType === "add") {
      onItemAdd(id);
    } else {
      onItemRemove(id);
    }
  }

  const handleInfiniteOnLoad = () => {
    let data = [...listItems];
    setLoading(true);
    if (data.length >= list.length) {
      setLoading(false);
      setHasMore(false);
      setPagination({ page: 1 });
      return;
    }
    const newPageSize = pagination.page + 1;

    const newData = [
      ...data,
      ...getListData({
        data: JSON.parse(JSON.stringify(list)),
        page: newPageSize
      })
    ];

    setListItems(newData);
    setLoading(false);
    setPagination({
      page: newPageSize
    })
  };

  React.useEffect(() => {
    if (list) {
      filterSearch(searchText, [...list]);
    }
  }, [list]);

  React.useEffect(() => {
    setLoading(!!loadingList);
  }, [loadingList]);

  return (
    <div className="oe-search-list">
      <Search placeHolder="Search users" onSearch={val => filterSearch(val, [...list])} />
        <div className="oe-infinite-container">
          <InfiniteScroll
            initialLoad={false}
            pageStart={0}
            loadMore={handleInfiniteOnLoad}
            hasMore={!loading && hasMore}
            useWindow={false}
          >
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
              {loading && hasMore && (
                <div className="demo-loading-container">
                  <Spin />
                </div>
              )}
            </List>
          </InfiniteScroll>
        </div>
    </div>
  );
}

export default SearchList;
