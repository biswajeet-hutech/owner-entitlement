import React from 'react';
import { Input, List, Popover } from 'antd';
import { EyeFilled } from "@ant-design/icons";
import { AddIcon, TickIcon, EditWhiteIcon, ViewHoverIcon } from './../../assets';
import Button from "../../components/button";
import SearchList from "../../components/search-list";
import API, { localMode } from '../../api';
import dummyWorkgroupMembers from "../../data/workgroup-members.json";

const WorkGroupInput = ({ options, readOnly, onChange, value, approverData, ...otherProps }) => {
  const { allowedActions } = otherProps;
  const [workgroupInfo, setWorkgroupInfo] = React.useState({ name: '', description: ''});
  const [showCreateWorkgroupForm, setShowCreateWorkgroupForm] = React.useState(false);
  const [workgroupError, setWorkgroupError] = React.useState('');
  const [workgroupMembers, setWorkgroupMembers] = React.useState([]);
  const [editPopVisible, setEditPopVisible] = React.useState({});
  const [viewPopVisible, setViewPopVisible] = React.useState({});

  const workgroupMembersDropList = workgroupMembers.map(item => ({
    label: item.displayName || (item.firstname ? `${item.firstname} ${item.lastname}` : item.name),
    id: item.name,
    action: 'remove',
    searchString: `${item.displayName || ''} ${item.firstname || ''} ${item.lastname || ''} ${item.name || ''}`
  }));

  const workgroupMembersIdList = workgroupMembersDropList.map(item => item.id);
  const AllUsersDropList = otherProps.allUsers && otherProps.allUsers.filter(item => !workgroupMembersIdList.includes(item.name)).map(item => ({
    label: item.displayName || (item.firstname ? `${item.firstname} ${item.lastname}` : item.name),
    id: item.name,
    action: 'add',
    searchString: `${item.displayName || ''} ${item.firstname || ''} ${item.lastname || ''} ${item.name || ''}`
  }));
  
  const combinedUsersList = [
    ...workgroupMembersDropList,
    ...AllUsersDropList
  ];

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

  // const handleAddVisibleChange = (v, index) => {
  //   // console.log(visible)
  //   setAddPopVisible({
  //     ...addPopVisible,
  //     [index]: v
  //   });
  // }

  const getWorkgroupMembers = (workgroupId) => {
    if (workgroupId) {
      API.post('/EntitlementManagement/workgroup/details', {
        "id": workgroupId
      }).then(response => {
        if (Array.isArray(response.data)) {
          setWorkgroupMembers(stateData => [...response.data]);
        }
      }).catch(err => {
        if (localMode) {
          const result = []
  
          setWorkgroupMembers(stateData => [
            ...dummyWorkgroupMembers,
            ...result
          ]);
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
                    {/* <div className="oe-form-error-text">{otherProps.error}</div> */}
                    <div style={{  margin: '10px 0' }}>
                      <div style={{ width: '200px', fontSize: 13 }}>New Workgroup: </div>
                      <div style={{ display: 'flex', alignItems: 'center', margin: '4px 0' }}>
                        <Input value={workgroupInfo.name} onChange={e => changeWorkgroupInfo(e.target.value, 'name')} placeholder="Workgroup Name"></Input>
                        <Input value={workgroupInfo.description} onChange={e => changeWorkgroupInfo(e.target.value, 'description')} placeholder="Workgroup Description"></Input>
                        <Button onClick={handleCreateWorkgroup}>Create</Button>
                      </div>
                      { workgroupError && <div className="oe-form-error-text">{workgroupError}</div> }
                    </div>
                </>
                ) : (
                  <>
                  {
                    (Array.isArray(approverData) && approverData.length > 1) && (
                    <p>
                      If you want to create a new workgroup with selected approvers, <a onClick={() => setShowCreateWorkgroupForm(true)}>click here</a>
                    </p>
                    )
                  }
                  </>
                )
              } 
              </>
            )}
            dataSource={options}
            renderItem={(item, key) => (
              <List.Item
                onClick={() => onChange(item.value)}
                style={{ backgroundColor: value === item.value ? '#037da1' : '#fff', color: value === item.value ? '#fff' : '#191919', padding: '4px 8px', fontSize: 13, cursor: 'pointer' }}>
                <span>{item.label}</span>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Popover
                      content={
                      <SearchList
                      list={[...workgroupMembersDropList]}
                      labelProp="label"
                      action="view"
                      onItemAdd={() => {}}
                      onItemRemove={() => {}}
                      />}
                      title=""
                      trigger="click"
                      visible={viewPopVisible[key]}
                      destroyTooltipOnHide
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
                          list={[...combinedUsersList]}
                          labelProp="label"
                          action="edit"
                          onItemAdd={handleAddItem}
                          onItemRemove={handleRemoveItem}
                          searchKeys={['firstname', 'lastname', 'displayName', 'name']}
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
                        {/* <Popover
                          content={
                          <SearchList
                          list={AllUsersDropList}
                          labelProp="label"
                          action="add"
                          onItemAdd={otherProps.onItemAdd}
                          onItemRemove={otherProps.onItemRemove}
                          />}
                          title=""
                          trigger="click"
                          visible={addPopVisible[key]}
                          destroyTooltipOnHide
                          onVisibleChange={(v) => handleAddVisibleChange(v, key)}
                        >
                          <p style={{ margin: 0 }}>
                            <AddIcon width={16} height={16} />
                          </p>
                        </Popover> */}
                        {/* { value === item.value && <p style={{ margin: 0 }} title="Selected Workgroup"><TickIcon width={16} height={16} /></p>} */}
                        </>
                      )
                    } 
                   </div>
                </div>
              </List.Item>
            )}
          />
          {
            otherProps.error && <p style={{ color: 'red' }}> { otherProps.error }</p>
          }
        </>
        )
      }
    </>
  )
}

export default WorkGroupInput;