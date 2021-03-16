import React from "react";
import { message, Select, Spin } from 'antd';
import './style.scss';
import { getFormType } from "../../utils";
import FormElement from "../../components/form-element";
import API, { localMode } from "../../api";
import approverDummyData from "../../data/approver-data.json";
import { messages } from "../../assets";

const { Option, OptGroup } = Select;

const ExtendedProperties = (props) => {
  const {
    entitlementData={},
    extendedProps=[],
    readOnly,
    onChange,
    errors={}
  } = props;

  const [approverLevelData, setApproverLevelData] = React.useState({});
  const [workgroupAccess, setWorkgroupAccess] = React.useState({approver_level2: {}, approver_level3: {}})
  const [loadingWorkgroupList, setLoadingWorkgroupList] = React.useState({approver_level2: false, approver_level3: false})
  const [approverStateData, setApproverStateData] = React.useState({approver_level2: null, approver_level3: null});
  const [workgroupStateData, setWorkgroupStateData] = React.useState({approver_level2: [], approver_level3: []});
  const [workgroupDetailsData, setWorkgroupDetailsData] = React.useState({approver_level2: [], approver_level3: []});
  const extendedPropsWithoutApprover =  Array.isArray(extendedProps) ? extendedProps.filter(item => !(['approval_levels', 'approver_level2', 'approver_level3'].includes(item.name))) : [];
  const extendedPropsWithApprover = Array.isArray(extendedProps) ? extendedProps.filter(item => (['approval_levels', 'approver_level2', 'approver_level3'].includes(item.name))) : [];

  const getApproverLevelData = async ({APIName, name}) => {
    API.get(APIName).then(res => {
      setApproverLevelData({
        approver_level2: res.data,
        approver_level3: res.data
      });
    }).catch(err => {
      if (localMode) {
        setApproverLevelData(stateData => ({
          approver_level2: approverDummyData,
          approver_level3: approverDummyData
        }));
      }
    })
  }

  const callWorkgroupDetailsAPI = (users, name, firstLoad) => {
    // console.log(users);
    if (users.length < 2) {
      if (firstLoad) {
        setWorkgroupDetailsData(stateData => ({
          ...stateData,
          [name]: users
        }));
        handleWorkgroupChange(name, users[0])
      } else {
        setWorkgroupDetailsData(stateData => ({
          ...stateData,
          [name]: []
        }));
        // handleWorkgroupChange(name, '')
      }
    } else {
      //set loader to true
      setLoadingWorkgroupList(stateData => ({
        ...stateData,
        [name]: true
      }));
      API.post('/EntitlementManagement/workgroup/assigned', {
        'identities': [...users]
      }).then(res => {
        setWorkgroupDetailsData(stateData => ({
          ...stateData,
          [name]: res.data
        }));
        // handleWorkgroupChange(name, '')
      }).catch(err => {
        if (localMode) {
          const response = {
            data: [
              "Approver Level1",
              "Approver Level2",
              "Approver Level3",
            ]
          }
          setWorkgroupDetailsData(stateData => ({
            ...stateData,
            [name]: response.data
          }));
          // handleWorkgroupChange(name, '')
        }
      }).finally(res => {
        setLoadingWorkgroupList(stateData => ({
          ...stateData,
          [name]: false
        }));
      })
    }
  }

  const formGroupData = Array.isArray(extendedPropsWithoutApprover) ? extendedPropsWithoutApprover.map(props => {
    const formType = getFormType(props);
    const formValue = formType === 'checkbox' ? ["true", "Yes", "TRUE", "YES", "yes", "True"].includes(entitlementData[props.name]) : entitlementData[props.name];
    return {
      key: props.name,
      label: props.displayName,
      value: formValue,
      type: formType,
      maxLength: formType === 'input' ? 100 : null,
      options: formType === "dropdown" ? (Array.isArray(props.allowedValues) && props.allowedValues.map(item => ({ label: item, value: item }))) : null,
      onChange: (value) => onChange(props.name, value),
      readOnly: readOnly,
      error: errors[props.name],
      // required: ['input', 'dropdown'].includes(formType) && props.name !== 'approval_levels',
    }
  }) : [];

  const ext_props_with_approver = extendedPropsWithApprover.reduce((acc, item) => {
    acc[item.name] = item;
    return acc;
  }, {});

  const onChangeApprover = (key, val, forceLoadType) => {
    let result = [];
    const workgroupKeys = approverLevelData[key].filter(item => item.workgroup === 'true').map(item => item.name);
    const selectedVal = approverLevelData[key].find(item => item.name === val[val.length - 1]) || {};
    const isWorkgroup = forceLoadType === "workgroup" || (selectedVal.workgroup === "true");

    if (isWorkgroup) {
      if (selectedVal.name) {
        result.push(selectedVal.name);
        if (!forceLoadType) {
          onChange(key, selectedVal.name);
        }
      }
    } else {
      if (val.some(item => workgroupKeys.includes(item))) {
        result.push(val[val.length - 1])
      } else {
        result = [...val];
      }

      handleWorkgroupChange(key, '');
    }

    if(!val.length) {
      if (!forceLoadType) {
        onChange(key, null);
      }
    }

    callWorkgroupDetailsAPI(result, key, isWorkgroup);
    setApproverStateData(stateData => ({
      ...stateData,
      [key]: result
    }));

    if (!forceLoadType) {
      onChange(key, result);
    }
  }

  const getWorgroupAccess = (key, value) => {
    if (value) {
      API.post('/EntitlementManagement/workgroup/isWorkGroupMemberUpdateAllowed', {
          "attrVal": value,
          "attrName": key
        }
      ).then(res => {
        setWorkgroupAccess(stateData => ({
          ...stateData,
          [key]: {
            ...stateData[key],
            [value]: res.data?.allowed === "true"
          }
        }))
      }).catch(err => {
        console.log(err);
        if (localMode) {
          setWorkgroupAccess(stateData => ({
            ...stateData,
            [key]: {
              ...stateData[key],
              [value]: true
            }
          }))
        }
      })  
    }
  }

  const handleWorkgroupChange = (key, value) => {
    setWorkgroupStateData(stateData => ({
      ...stateData,
      [key]: value
    }));
    onChange(key, value);
    getWorgroupAccess(key, value);
  }

  const handleCreateWorkgroup = (workgroupInfo, approverLevel) => {
    if (approverStateData[approverLevel].length) {
      API.post('/EntitlementManagement/workgroup/create', {
        "name": workgroupInfo.name,
        "description": workgroupInfo.description,
        "members": [...approverStateData[approverLevel]]
      }).then(res => {
        if (res.data.status === "success") {
          message.success(res.data.message);
          callWorkgroupDetailsAPI(approverStateData[approverLevel], approverLevel);
        } else if (res.data.status === "failed") {
          message.error(res.data.message);
        }
      }).catch(err => {
        console.log(err);
        if (localMode) {
          message.success(messages.SUCCESS_MESSAGE.WORKGROUP_CREATE);
          callWorkgroupDetailsAPI(approverStateData[approverLevel], approverLevel);
        }
      })
    }
  }

  const handleWorkgroupMember = (action, id, workgroupName, propName) => {
    API.post('/EntitlementManagement/workgroup/update/members', {
      "name": workgroupName,
      "add": action === "add" ? [id] : null,
      "remove": action === "remove" ? [id] : null,
    }).then(response => {
      if (response.data.status === "success") {
        message.success(`Member ${action === "add" ? "added" : "removed"} Successfully`);
        if (approverStateData[propName].length > 1) {
          if (action === "add") {
            setApproverStateData(stateData => ({
              ...stateData,
              [propName]: [...new Set([...stateData[propName], id])]
            }))
          } else if (action === "remove") {
            setApproverStateData(stateData => ({
              ...stateData,
              [propName]: stateData[propName].filter(item => item !== id)
            }))
          }
        }
      } else {
        message.error(messages.ERRORS.ACTION);
      }
    }).catch(error => {
      message.error(messages.ERRORS.ACTION);
      if (localMode) {
        if (approverStateData[propName].length > 1) {
          if (action === "add") {
            setApproverStateData(stateData => ({
              ...stateData,
              [propName]: [...new Set([...stateData[propName], id])]
            }))
          } else if (action === "remove") {
            setApproverStateData(stateData => ({
              ...stateData,
              [propName]: stateData[propName].filter(item => item !== id)
            }))
          }
        }
      }
    })
  }

  const handleApproverChange = (key, value='') => {
    onChange(key, value || '');
    // console.log(typeof value, value);
    switch(value) {
      case "":
      case undefined:
        setApproverStateData(stateData => ({
          ...stateData,
          approver_level2: [],
          approver_level3: []
        }));
        break;
      case "1":
        setApproverStateData(stateData => ({
          ...stateData,
          approver_level2: [],
          approver_level3: []
        }));
        break;
      case "2":
        setApproverStateData(stateData => ({
          ...stateData,
          approver_level3: []
        }));
        break;
      default:
        break;
    }
  }

  const renderApproverLevel = (props) => {
    if (props) {
      return (
        <FormElement
          key={props.name}
          label={props.displayName}
          value={entitlementData[props.name]}
          type='dropdown'
          options={props.allowedValues.map(item => ({ label: item, value: item }))}
          onChange={(value) => handleApproverChange(props.name, value)}
          readOnly={readOnly}
          error={errors[props.name]}
          required={props.required}
        />
      )
    }
  }

  const renderApproverLevel2_3 = (props) => {
    if (props) {
      let workgroupList = Array.isArray(workgroupDetailsData[props.name]) ? workgroupDetailsData[props.name].map(item => ({
        label: item,
        value: item
      })) : [];

      let dropdownData = Array.isArray(approverLevelData[props.name]) ?  approverLevelData[props.name].map(item => ({
        label: item.name,
        value: item.name,
        workgroup: item.workgroup === 'true'
      })) : [];

      let allMembersData = approverLevelData[props.name] && approverLevelData[props.name].filter(item => (item.workgroup !== "true" && !(approverStateData[props.name]?.includes(item.name))));
      const workgroupListMap = dropdownData.filter(item => item.workgroup).map(item => item.value);
      const isWorkgroupSelected = !!(approverStateData[props.name] && approverStateData[props.name][0] && workgroupListMap.includes(approverStateData[props.name][0]));
      const showWorkgroupList = !readOnly && (!isWorkgroupSelected ? approverStateData[props.name]?.length > 1 : true) && !loadingWorkgroupList[props.name];
      console.log(isWorkgroupSelected);
      const renderOptions = () => {
        const workgroupList = dropdownData.filter(item => !!item.workgroup);
        const nonWorkgroupList = dropdownData.filter(item => !item.workgroup);
        
        return (
        <>
          <OptGroup label="Workgroup">
            {
              workgroupList.map(option => (
                <Option value={option.value}>{option.label}</Option>
              ))
            }
          </OptGroup>
          <OptGroup label="Members">
          {
            nonWorkgroupList.map(option => (
              <Option value={option.value}>{option.label}</Option>
            ))
          }
          </OptGroup>
        </>
      );
      }
      return (
        <>
          <FormElement
            key={props.name}
            label={props.displayName}
            value={readOnly ? entitlementData[props.name] : approverStateData[props.name]}
            type='chip_dropdown'
            options={dropdownData}
            onChange={(value) => onChangeApprover(props.name, value)}
            readOnly={readOnly}
            error={!!showWorkgroupList ? '' : errors[props.name]}
            required={props.required}
            placeholder={messages.FORM.APPROVER_PLACEHOLDER}
            renderOptions={renderOptions()}
            isWorkgroup={!!workgroupListMap.includes(entitlementData[props.name])}
          />
          { loadingWorkgroupList[props.name] && (
            <div className="oe-workgroup-loader">
              <Spin spinning={loadingWorkgroupList[props.name]}></Spin>
            </div>
          )}
          {
            !!showWorkgroupList ? (
              <FormElement
                value={workgroupStateData[props.name]}
                label={`${messages.FORM.WORKGROUP_LABEL} ${props.name.includes('2') ? '2' : '3'}`}
                type='workgroup'
                options={workgroupList}
                onChange={(value) => handleWorkgroupChange(props.name, value )}
                onCreate={workgroupInfo => handleCreateWorkgroup(workgroupInfo, props.name)}
                readOnly={readOnly}
                allUsers={allMembersData}
                onItemAdd={(id) => handleWorkgroupMember('add', id, workgroupStateData[props.name], props.name)}
                onItemRemove={(id) => handleWorkgroupMember('remove', id, workgroupStateData[props.name], props.name)}
                error={errors[props.name]}
                allowedActions={workgroupAccess[props.name]}
                approverData={approverStateData[props.name]}
              />
            ) : null
          }
        </>
      )
    }
  }

  React.useEffect(() => {
    if (Object.keys(entitlementData).length) {
      if (!approverStateData.approver_level2 || !approverStateData.approver_level3) {
        const approver_level2_data = entitlementData.approver_level2 ? [entitlementData.approver_level2] : []
        const approver_level3_data = entitlementData.approver_level3 ? [entitlementData.approver_level3] : []
        setApproverStateData(stateData => ({
          ...stateData,
          approver_level2: approver_level2_data,
          approver_level3: approver_level3_data
        }));
      }
    }
  }, []);

  React.useEffect(() => {
    if (ext_props_with_approver.approver_level2) {
      getApproverLevelData(ext_props_with_approver.approver_level2);
    }
  }, [ext_props_with_approver.approver_level2]);

  React.useEffect(() => {
    if (!readOnly) {
      const approver_level2_data = entitlementData.approver_level2 ? [entitlementData.approver_level2] : []
      if (approverLevelData.approver_level2) {
        onChangeApprover('approver_level2', approver_level2_data, "workgroup");
      }
    }
  }, [approverLevelData.approver_level2]);

  React.useEffect(() => {
    if (!readOnly) {
      const approver_level3_data = entitlementData.approver_level3 ? [entitlementData.approver_level3] : []
      if (approverLevelData.approver_level3) {
        onChangeApprover('approver_level3', approver_level3_data, "workgroup");
      }
    }
  }, [approverLevelData.approver_level3]);

  return (
    <>
    <div className="form-section extended-property-section">
      {
        formGroupData.map(formElement => <FormElement {...formElement} />)
      }
      {
        ext_props_with_approver.approval_levels && renderApproverLevel(ext_props_with_approver.approval_levels)
      }
      {
        ext_props_with_approver.approver_level2 && entitlementData.approval_levels > "1" && renderApproverLevel2_3(ext_props_with_approver.approver_level2)
      }
      {
        ext_props_with_approver.approver_level3 && entitlementData.approval_levels > "2" && renderApproverLevel2_3(ext_props_with_approver.approver_level3)
      }
    </div>
    </>
  );
}

export default ExtendedProperties;
