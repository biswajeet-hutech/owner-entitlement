import React from 'react';
import { Button, Input, List, Popover } from 'antd';
import { EyeFilled } from "@ant-design/icons";
import debounce from 'lodash/debounce';
import _ from "lodash";

import { EditWhiteIcon } from './../../assets';
import SearchList from "../../components/search-list";
import API, { localMode } from '../../api';

const WorkGroupInput = ({ options, readOnly, onChange, value, approverData, fetchOptions, defaultSearchValue, ...otherProps }) => {
  const { allowedActions } = otherProps;
  const [workgroupInfo, setWorkgroupInfo] = React.useState({ name: '', description: ''});
  const [showCreateWorkgroupForm, setShowCreateWorkgroupForm] = React.useState(false);
  const [workgroupError, setWorkgroupError] = React.useState('');
  const [workgroupSearchText, setWorkgroupSearchText] = React.useState('');
  const [workgroupMembers, setWorkgroupMembers] = React.useState([]);
  const [originalWorkgroupMembers, setOriginalWorkgroupMembers] = React.useState([]);
  const [entitlementUsers, setEntitlementUsers] = React.useState([]);
  const [editPopVisible, setEditPopVisible] = React.useState({});
  const [viewPopVisible, setViewPopVisible] = React.useState({});
  const [fetching, setFetching] = React.useState(false);
  const fetchRef = React.useRef(0);
  const debounceTimeout = 800;

  const workgroupMembersIdList = workgroupMembers.map(item => item.id);
  const workgroupMembersNameList = workgroupMembers.map(item => item.name);

  const AllUsersDropList = Array.isArray(entitlementUsers) && entitlementUsers.map(item => ({
    label: item.label,
    value: item.value,
    id: item.value,
    action: (workgroupMembersIdList.includes(item.id) || workgroupMembersNameList.includes(item.name)) ? 'remove' : 'add'
  }));
  
  const combinedUsersList = workgroupSearchText ? [...(AllUsersDropList || [])] : _.uniqBy([...(workgroupMembers || []), ...(AllUsersDropList || [])], 'id');

  const handleCreateWorkgroup = () => {
    if (!workgroupInfo.name) {
      setWorkgroupError('Enter a workgroup name');
    } else {
      setWorkgroupError('');
      otherProps.onCreate(workgroupInfo);
      setShowCreateWorkgroupForm(false);
    }
  }

  const changeWorkgroupInfo = (value, key) => {
    setWorkgroupInfo({
      ...workgroupInfo,
      [key]: value
    })
  }

  const handleEditVisibleChange = (v, index) => {
    setEditPopVisible({
      ...editPopVisible,
      [index]: v
    });
  }

  const handleViewVisibleChange = (v, index) => {
    setViewPopVisible({
      ...viewPopVisible,
      [index]: v
    });
  }

  const debounceFetcher = React.useMemo(() => {
    const loadOptions = (value) => {
      fetchRef.current += 1;
      const fetchId = fetchRef.current;
      setEntitlementUsers([]);
      setWorkgroupSearchText(value);
      setFetching(true);
      fetchOptions(value).then((newOptions) => {
        if (fetchId !== fetchRef.current) {
          // for fetch callback order
          return;
        }
        setEntitlementUsers(newOptions);
        setFetching(false);
      });
    };

    return debounce(loadOptions, debounceTimeout);
  }, [fetchOptions, debounceTimeout]);

  const getWorkgroupMembers = (workgroupId) => {
    if (workgroupId) {
      API.post('/EntitlementManagement/workgroup/details', {
        "id": workgroupId
      }).then(response => {
        if (Array.isArray(response.data)) {
          const output = response.data.map(item => ({
            label: item.displayName || (item.firstname ? `${item.firstname} ${item.lastname}` : item.name),
            id: item.id,
            value: item.id,
            name: item.name,
            action: 'remove',
            searchString: `${item.displayName || ''} ${item.firstname || ''} ${item.lastname || ''} ${item.name || ''}`
          }))
          setWorkgroupMembers(stateData => output);
          setOriginalWorkgroupMembers(stateData => output);
        }
      }).catch(err => {
        if (localMode) {
          import("../../data/workgroup-members.json").then(res => {
            const result = res.default.map(item => ({
              label: item.displayName || (item.firstname ? `${item.firstname} ${item.lastname}` : item.name),
              id: item.id,
              value: item.id,
              name: item.name,
              action: 'remove',
              searchString: `${item.displayName || ''} ${item.firstname || ''} ${item.lastname || ''} ${item.name || ''}`
            }))
            
            setWorkgroupMembers(stateData => result);
            setOriginalWorkgroupMembers(stateData => result);
          })
        }
      })
    }
  }

  const handleAddItem = async (...props) => {
    await otherProps.onItemAdd(...props);
    setTimeout(() => {
      getWorkgroupMembers(value);
    }, 1000);
  }

  const handleRemoveItem = async (...props) => {
    await otherProps.onItemRemove(...props);
    setTimeout(() => {
      getWorkgroupMembers(value);
    }, 1000);
  }

  React.useEffect(() => {
    getWorkgroupMembers(value)
  }, [value]);

  React.useEffect(() => {
    if (!options.length) {
      setShowCreateWorkgroupForm(true);
    } else {
      setShowCreateWorkgroupForm(false);
    }
  }, [options, approverData]);

  const filterSearch = (searchText) => {
    const filteredList = originalWorkgroupMembers.filter(item => ((item.searchString || '').toLowerCase()).includes(searchText.toLowerCase()));
    
    setWorkgroupMembers(filteredList);
  }

  React.useEffect(() => {
    const values = Object.values(editPopVisible);
    if (values.some(item => item)) {
      fetchOptions('').then((newOptions) => {
        setEntitlementUsers(newOptions);
        setFetching(false);
      });
    }
  }, [editPopVisible]);

  return (
    <>
      {
        readOnly ? <span>{ value }</span> : (
        <>
          <List
            className={`oe-workgroup-list ${!value && 'oe-workgroup-list-error'}`}
            size="small"
            locale={{
              emptyText: 'No common workgroup found, create one below.'
            }}
            footer={(
              <>
              {
                showCreateWorkgroupForm ? (
                  <>
                    <div style={{  padding: 10, border: '1px solid #ccc', 'border-radius': 4 }}>
                      <div style={{ width: '200px', fontSize: 13 }}>New Workgroup: </div>
                      <div style={{ display: 'flex', alignItems: 'center', margin: '4px 0' }}>
                        <Input
                          value={workgroupInfo.name}
                          onChange={e => changeWorkgroupInfo(e.target.value, 'name')}
                          placeholder="Workgroup Name"
                          className="form-input"
                        />
                        <Input
                          value={workgroupInfo.description}
                          onChange={e => changeWorkgroupInfo(e.target.value, 'description')}
                          placeholder="Workgroup Description"
                          className="form-input"
                        />
                        <Button
                          className="form-input-btn"
                          onClick={handleCreateWorkgroup}
                        >
                          Create
                        </Button>
                      </div>
                      { workgroupError && <div className="oe-form-error-text">{workgroupError}</div> }
                    </div>
                </>
                ) : null
              }
              </>
            )}
            dataSource={options}
            renderItem={(item, key) => (
              <List.Item
                onClick={(e) => {onChange(item.value, item); e.stopPropagation()}}
                style={{ backgroundColor: value === item.value ? '#037da1' : '#fff', color: value === item.value ? '#fff' : '#191919', padding: '4px 8px', fontSize: 13, cursor: 'pointer' }}>
                <span>{item.label}</span>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Popover
                      content={
                      <SearchList
                        list={[...workgroupMembers]}
                        labelProp="label"
                        action="view"
                        onItemAdd={() => {}}
                        onItemRemove={() => {}}
                        onSearch={filterSearch}
                      />}
                      title=""
                      trigger="click"
                      visible={viewPopVisible[key]}
                      destroyTooltipOnHide
                      onClick={e => e.stopPropagation()}
                      onVisibleChange={(v) => handleViewVisibleChange(v, key)}
                    >
                      <p style={{ margin: 0, display: 'flex' }} title="View members" onClick={e => e.stopPropagation()}>
                        <EyeFilled style={{ color: 'white', fontSize: 16}} />
                      </p>
                    </Popover>
                  {
                    !item.isWorkgroupOwner && allowedActions[item.value] && (
                      <>
                        <Popover
                          content={
                          <SearchList
                            list={combinedUsersList}
                            labelProp="label"
                            action="edit"
                            onItemAdd={handleAddItem}
                            onItemRemove={handleRemoveItem}
                            searchKeys={['firstname', 'lastname', 'displayName', 'name']}
                            onSearch={debounceFetcher}
                            loadingList={!!fetching}
                          />}
                          title=""
                          trigger="click"
                          visible={editPopVisible[key]}
                          destroyTooltipOnHide
                          onVisibleChange={(v) => handleEditVisibleChange(v, key)}
                        >
                          <p style={{ margin: 0, display: 'flex' }} title="Edit members" onClick={e => e.stopPropagation()}>
                            <EditWhiteIcon width={16} height={16} className="oe-workgroup-icons" />
                          </p>
                        </Popover>
                      </>
                      )
                    } 
                   </div>
                </div>
              </List.Item>
            )}
          />
          {
            otherProps.error && <p className="oe-form-error-text"> { otherProps.error }</p>
          }
        </>
        )
      }
    </>
  )
}

export default WorkGroupInput;