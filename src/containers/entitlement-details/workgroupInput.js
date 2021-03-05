import React from 'react';
import { Input, List, Popover } from 'antd';

import { AddIcon, TickIcon, EditWhiteIcon } from './../../assets';
import Button from "../../components/button";
import SearchList from "../../components/search-list";
import API, { localMode } from '../../api';
import dummyWorkgroupMembers from "../../data/workgroup-members.json";

const WorkGroupInput = ({options, readOnly, onChange, value, ...otherProps}) => {
  const [workgroupInfo, setWorkgroupInfo] = React.useState({ name: '', description: ''});
  const [showCreateWorkgroupForm, setShowCreateWorkgroupForm] = React.useState(false);
  const [workgroupError, setWorkgroupError] = React.useState('');
  const [workgroupMembers, setWorkgroupMembers] = React.useState([]);
  const workgroupMembersDropList = workgroupMembers.map(item => ({ label:  item.firstname ? `${item.firstname || item.firstName} ${item.lastname || item.lastName}` : item.name, id: item.name }));
  const AllUsersDropList = otherProps.allUsers && otherProps.allUsers.map(item => ({ label:  item.firstname ? `${item.firstname || item.firstName} ${item.lastname || item.lastName}` : item.name, id: item.name }));
  const [editPopVisible, setEditPopVisible] = React.useState({});
  const [addPopVisible, setAddPopVisible] = React.useState({});
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
    // console.log(visible)
    setEditPopVisible({
      ...editPopVisible,
      [index]: v
    });
  }

  const handleAddVisibleChange = (v, index) => {
    // console.log(visible)
    setAddPopVisible({
      ...addPopVisible,
      [index]: v
    });
  }

  const getWorkgroupMembers = (workgroupName) => {
    API.post('/EntitlementManagement/workgroup/details', {
      "name": workgroupName
    }).then(response => {
      if (Array.isArray(response.data)) {
        setWorkgroupMembers([...response.data]);
      }
    }).catch(err => {
      if (localMode) {
        setWorkgroupMembers([...dummyWorkgroupMembers]);
      }
    })
  }

  React.useEffect(() => {
    getWorkgroupMembers(value)
  }, [value]);

  // React.useEffect(() => {
  //   getWorkgroupMembers()
  // }, []);

  return (
    <>
      {
        readOnly ? <span>{ value }</span> : (
        <>
          <List
            className="oe-workgroup-list"
            size="small"
            locale={{
              emptyText: ''
            }}
            // header={<div style={{ fontSize: 13, padding: '0 0 10px' }}>Associated Workgroup:</div>}
            footer={(
              <>
              {
                showCreateWorkgroupForm ? (
                  <>
                    <div className="oe-form-error-text">{otherProps.error}</div>
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
                <p>
                  If you want to create a new workgroup with selected approvers, <a onClick={() => setShowCreateWorkgroupForm(true)}>click here</a></p>)
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
                  {
                    !item.isWorkgroupOwner && (
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <Popover
                          content={
                          <SearchList
                          list={workgroupMembersDropList}
                          labelProp="label"
                          action="edit"
                          onItemAdd={otherProps.onItemAdd}
                          onItemRemove={otherProps.onItemRemove}
                          />}
                          title=""
                          trigger="click"
                          visible={editPopVisible[key]}
                          
                          onVisibleChange={(v) => handleEditVisibleChange(v, key)}
                        >
                          <p style={{ margin: 0 }}>
                            <EditWhiteIcon width={16} height={16} title="Edit members" />
                          </p>
                        </Popover>
                        <Popover
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
                          
                          onVisibleChange={(v) => handleAddVisibleChange(v, key)}
                        >
                          <p style={{ margin: 0 }}>
                            <AddIcon width={16} height={16} className="oe-workgroup-icons" />
                          </p>
                        </Popover>
                        { value === item.value && <p style={{ margin: 0 }} title="Selected Workgroup"><TickIcon width={16} height={16} /></p>}
                      </div>
                    )
                  }
                </div>
              </List.Item>
            )}
          />
        </>
        )
      }
    </>
  )
}

export default WorkGroupInput;