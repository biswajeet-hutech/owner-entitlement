import React from "react";
import { message, Select, Spin } from 'antd';
import './style.scss';
import { getFormType } from "../../utils";
import FormElement from "../../components/form-element";
import API, { localMode } from "../../api";
import approverDummyData from "../../data/approver-data.json";
import { messages } from "../../assets";
import formConfig from "./form-config";

const { Option, OptGroup } = Select;

const ExtendedProperties = (props) => {
  const {
    originalData={},
    entitlementData={},
    extendedProps=[],
    readOnly,
    onChange,
    errors={},
    onEntityLoad=()=>{}
  } = props;

  const [approverLevelData, setApproverLevelData] = React.useState({});
  const [workgroupAccess, setWorkgroupAccess] = React.useState({approverLevel2: {}, approverLevel3: {}})
  const [loadingWorkgroupList, setLoadingWorkgroupList] = React.useState({approverLevel2: false, approverLevel3: false})
  const [approverStateData, setApproverStateData] = React.useState({approverLevel2: null, approverLevel3: null});
  const [workgroupStateData, setWorkgroupStateData] = React.useState({approverLevel2: [], approverLevel3: []});
  const [workgroupDetailsData, setWorkgroupDetailsData] = React.useState({approverLevel2: [], approverLevel3: []});
  const extendedPropsWithoutApprover =  Array.isArray(extendedProps) ? extendedProps.filter(item => !(['approvalLevels', 'approverLevel2', 'approverLevel3'].includes(item.name))) : [];
  const extendedPropsWithApprover = Array.isArray(extendedProps) ? extendedProps.filter(item => (['approvalLevels', 'approverLevel2', 'approverLevel3'].includes(item.name))) : [];

  const getApproverLevelData = async ({APIName, name}) => {
    onEntityLoad(true);
    API.get(APIName).then(res => {
      setApproverLevelData({
        approverLevel2: res.data,
        approverLevel3: res.data
      });
    }).catch(err => {
      if (localMode) {
        setApproverLevelData(stateData => ({
          approverLevel2: approverDummyData,
          approverLevel3: approverDummyData
        }));
      }
    }).finally(() => {
      onEntityLoad(false);
    })
  }

  const callWorkgroupDetailsAPI = (users, name, firstLoad) => {
    if (users.length < 2) {
      if (firstLoad) {
        const selectedWorkgroupObject = approverLevelData[name]?.find(item => item.id === users[0]);
        setWorkgroupDetailsData(stateData => ({
          ...stateData,
          [name]: [selectedWorkgroupObject || {}]
        }));
        handleWorkgroupChange(name, selectedWorkgroupObject?.id || '')
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
              {
                "id": "0a0000047190181b817190f9602f0013",
                "name": "Approver Level1"
              },
              {
                "id": "0a0000047190181b817190f9602f0013",
                "name": "Approver Level2"
              },
              {
                "id": "0a0000047190181b817190f9602f0013",
                "name": "Approver Level3"
              },
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
      ...(formConfig[props.name] || {})
    }
  }) : [];

  const ext_props_with_approver = extendedPropsWithApprover.reduce((acc, item) => {
    acc[item.name] = item;
    return acc;
  }, {});

  const onChangeApprover = (key, val, forceLoadType) => {
    let result = [];
    const workgroupKeys = approverLevelData[key].filter(item => item.workgroup === 'true').map(item => item.id);
    const selectedVal = approverLevelData[key].find(item => item.id === val[val.length - 1]) || {};
    const isWorkgroup = forceLoadType === "workgroup" || (selectedVal.workgroup === "true");

    if (isWorkgroup) {
      if (selectedVal.id) {
        result.push(selectedVal.id);
        if (!forceLoadType) {
          onChange(key, selectedVal.id);
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
    onChange(key, value ? [value] : '');
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
          approverLevel2: [],
          approverLevel3: []
        }));
        break;
      case "1":
        setApproverStateData(stateData => ({
          ...stateData,
          approverLevel2: [],
          approverLevel3: []
        }));
        break;
      case "2":
        setApproverStateData(stateData => ({
          ...stateData,
          approverLevel3: []
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
        label: item.name,
        value: item.id
      })) : [];

      let dropdownData = Array.isArray(approverLevelData[props.name]) ?  approverLevelData[props.name].map(item => ({
        label: item.displayName || item.name,
        value: item.displayName || item.name,
        id: item.id,
        workgroup: item.workgroup === 'true',
        searchString: `${item.displayName || ''} ${item.name || ''} ${item.firstname || ''} ${item.lastname || ''}`
      })) : [];

      const workgroupOptionList = dropdownData.filter(item => !!item.workgroup);
      const nonWorkgroupOptionList = dropdownData.filter(item => !item.workgroup);

      let workgroupKeys = Array.isArray(approverLevelData[props.name]) ?  approverLevelData[props.name].filter(item => item.workgroup === "true").map(item => item.id) : [];

      let allMembersData = (approverLevelData[props.name] && approverLevelData[props.name].filter(item => (item.workgroup !== "true" && !(approverStateData[props.name]?.includes(item.name))))) || [];

      const isWorkgroupSelected = !!(Array.isArray(originalData[props.name]) && originalData[props.name][0]?.workgroup);

      const showWorkgroupList = !readOnly && entitlementData[props.name] && (
        typeof entitlementData[props.name] === "string" ? (originalData[props.name] && originalData[props.name][0]?.workgroup) : (
        Array.isArray(entitlementData[props.name]) && (
          (entitlementData[props.name]?.length > 1 ? true : (workgroupKeys.includes(entitlementData[props.name][0]) ||  workgroupList.length > 0))
        ))
      );
      const renderOptions = () => {
        
        return (
        <>
          <OptGroup label="Workgroup">
            {
              workgroupOptionList.map(option => (
                <Option value={option.id} label={option.label} keyId={option.id}>{option.label}</Option>
              ))
            }
          </OptGroup>
          <OptGroup label="Members">
          {
            nonWorkgroupOptionList.map(option => (
              <Option value={option.id} label={option.label} keyId={option.id}>{option.label}</Option>
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
            dataObject={(entitlementData[props.name] && entitlementData[props.name][0]) || {}}
            value={readOnly ? (Array.isArray(entitlementData[props.name]) && entitlementData[props.name][0]?.name) : approverStateData[props.name]}
            type='chip_dropdown'
            options={dropdownData}
            onChange={(value) => onChangeApprover(props.name, value)}
            readOnly={readOnly}
            error={!!showWorkgroupList ? '' : errors[props.name]}
            required={props.required}
            placeholder={messages.FORM.APPROVER_PLACEHOLDER}
            renderOptions={renderOptions()}
            isWorkgroup={!!(isWorkgroupSelected)}
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
      if (!approverStateData.approverLevel2 || !approverStateData.approverLevel3) {
        const approverLevel2_data = (Array.isArray(entitlementData.approverLevel2) && entitlementData.approverLevel2[0]?.id) ? [entitlementData.approverLevel2[0]?.id] : []
        const approverLevel3_data = (Array.isArray(entitlementData.approverLevel3) && entitlementData.approverLevel3[0]?.id) ? [entitlementData.approverLevel3[0]?.id] : []
        setApproverStateData(stateData => ({
          ...stateData,
          approverLevel2: approverLevel2_data,
          approverLevel3: approverLevel3_data
        }));
      }
    }
  }, []);

  React.useEffect(() => {
    if (!readOnly) {
      if (ext_props_with_approver.approverLevel2) {
        getApproverLevelData(ext_props_with_approver.approverLevel2);
      }
    }
  }, [ext_props_with_approver.approverLevel2]);

  React.useEffect(() => {
    if (!readOnly) {
      const approverLevel2_data = (Array.isArray(entitlementData.approverLevel2) && entitlementData.approverLevel2[0]?.id) ? [entitlementData.approverLevel2[0].id] : []
      if (approverLevelData.approverLevel2) {
        onChangeApprover('approverLevel2', approverLevel2_data, "workgroup");
      }
    }
  }, [approverLevelData.approverLevel2]);

  React.useEffect(() => {
    if (!readOnly) {
      const approverLevel3_data = (Array.isArray(entitlementData.approverLevel3) && entitlementData.approverLevel3[0]?.id) ? [entitlementData.approverLevel3[0].id] : []
      if (approverLevelData.approverLevel3) {
        onChangeApprover('approverLevel3', approverLevel3_data, "workgroup");
      }
    }
  }, [approverLevelData.approverLevel3]);

  return (
    <>
    <div className="form-section extended-property-section">
      {
        formGroupData.map(formElement => <FormElement {...formElement} />)
      }
      {
        ext_props_with_approver.approvalLevels && renderApproverLevel(ext_props_with_approver.approvalLevels)
      }
      {
        ext_props_with_approver.approverLevel2 && entitlementData.approvalLevels > "1" && renderApproverLevel2_3(ext_props_with_approver.approverLevel2)
      }
      {
        ext_props_with_approver.approverLevel3 && entitlementData.approvalLevels > "2" && renderApproverLevel2_3(ext_props_with_approver.approverLevel3)
      }
    </div>
    </>
  );
}

export default ExtendedProperties;
