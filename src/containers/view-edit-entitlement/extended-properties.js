import React from "react";
import { message, Spin } from 'antd';
import _ from "lodash";

import './style.scss';
import { getFormType } from "../../utils";
import FormElement from "../../components/form-element";
import API, { localMode } from "../../api";
import { messages } from "../../assets";
import formConfig from "./form-config";
import fetchUserList from "../../utils/user";

const ExtendedProperties = (props) => {
  const {
    originalData={},
    entitlementData={},
    extendedProps=[],
    readOnly,
    onChange,
    errors={}
  } = props;
  const [workgroupSelection, setWorkgroupSelection] = React.useState({});
  const [currentWorkgroup, setCurrentWorkgroup] = React.useState(null);
  const [workgroupAccess, setWorkgroupAccess] = React.useState({approverLevel2: {}, approverLevel3: {}})
  const [loadingWorkgroupList, setLoadingWorkgroupList] = React.useState({approverLevel2: false, approverLevel3: false})
  const [approverStateData, setApproverStateData] = React.useState({approverLevel2: null, approverLevel3: null});
  const [workgroupStateData, setWorkgroupStateData] = React.useState({approverLevel2: [], approverLevel3: []});
  const [workgroupDetailsData, setWorkgroupDetailsData] = React.useState({approverLevel2: [], approverLevel3: []});
  const extendedPropsWithoutApprover =  Array.isArray(extendedProps) ? extendedProps.filter(item => !(['approvalLevels', 'approverLevel2', 'approverLevel3'].includes(item.name))) : [];
  const extendedPropsWithApprover = Array.isArray(extendedProps) ? extendedProps.filter(item => (['approvalLevels', 'approverLevel2', 'approverLevel3'].includes(item.name))) : [];
  const readOnlyConfig = extendedProps.reduce((acc, item) => {
    acc[item.name] = item.readOnly;
    return acc;
  }, {})
  const callWorkgroupDetailsAPI = (users, name, workgroupDetails) => {
    if (users.length < 2) {
      if (workgroupDetails) {
        setWorkgroupDetailsData(stateData => ({
          ...stateData,
          [name]: [workgroupDetails || {}]
        }));
        handleWorkgroupChange(name, workgroupDetails?.id || '')
      } else {
        setWorkgroupDetailsData(stateData => ({
          ...stateData,
          [name]: []
        }));
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
      }).catch(err => {
        if (localMode) {
          const response = {
            data: []
          }
          setWorkgroupDetailsData(stateData => ({
            ...stateData,
            [name]: response.data
          }));
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
    const formValue = entitlementData[props.name];
    return {
      key: props.name,
      label: props.displayName,
      value: formValue,
      type: formType,
      maxLength: formType === 'input' ? 100 : null,
      options: formType === "dropdown" ? (Array.isArray(props.allowedValues) && props.allowedValues.map(item => ({ label: item, value: item }))) : null,
      onChange: (value) => onChange(props.name, value),
      readOnly: readOnly || readOnlyConfig[props.name],
      error: errors[props.name],
      ...(formConfig[props.name] || {})
    }
  }) : [];

  const ext_props_with_approver = extendedPropsWithApprover.reduce((acc, item) => {
    acc[item.name] = item;
    return acc;
  }, {});

  const onChangeApprover = (key, val, approverData) => {
    let result = [];

    if (val.length) {
      const workgroupKeys = Array.isArray(approverData) ? approverData.filter(item => item.workgroup).map(item => item.id) : [];
      const selectedVal = Array.isArray(approverData) ? approverData[val.length - 1] : approverData;
      const isWorkgroupSelected = selectedVal.workgroup;
      setWorkgroupSelection(stateData => ({
        ...stateData,
        [key]: isWorkgroupSelected
      }))

      if (isWorkgroupSelected) {
        //If current selection is a workgroup
        if (selectedVal.id) {
          result.push(selectedVal.id);
        }
      } else {
        //If current selection is not a workgroup
        if (workgroupKeys.length) {
          result.push(val[val.length - 1])
        } else {
          result = [...val];
        }

        handleWorkgroupChange(key, '');
      }

      callWorkgroupDetailsAPI(result, key, isWorkgroupSelected ? selectedVal : null);
      setApproverStateData(stateData => ({
        ...stateData,
        [key]: result
      }));

      onChange(key, result);
    }

    if (!approverData || !approverData.length || !val.length) {
      setWorkgroupSelection(stateData => ({
        ...stateData,
        [key]: false
      }))
      onChange(key, result);
    }
  }

  const getWorgroupAccess = (key, value) => {
    if (value && !workgroupAccess[key].hasOwnProperty(value)) {
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

  const handleWorkgroupChange = (key, value, workgroup) => {
    if (workgroup) {
      const currentWorkgroupObj = {
        label: workgroup.label,
        value: workgroup.value,
        id: workgroup.id,
        workgroup: true
      }
      if (!(_.isEqual(currentWorkgroup, currentWorkgroupObj))) {
        setCurrentWorkgroup(currentWorkgroupObj);
      }
    }

    setWorkgroupStateData(stateData => ({
      ...stateData,
      [key]: value
    }));

    setWorkgroupSelection(stateData => ({
      ...stateData,
      [key]: !!value
    }))

    onChange(key, value ? [value] : []);
    
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

  const handleWorkgroupMember = (action, id, workgroupId, propName) => {
    API.post('/EntitlementManagement/workgroup/update/members', {
      "id": workgroupId,
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
          readOnly={readOnly || readOnlyConfig[props.name]}
          error={errors[props.name]}
          required={props.required}
        />
      )
    }
  }

  const renderApproverLevel2_3 = (props) => {
    if (props) {
      let workgroupList = Array.isArray(workgroupDetailsData[props.name]) ? workgroupDetailsData[props.name].map(item => ({
        label: item.name || item.label,
        value: item.id
      })) : [];
      
      const showWorkgroupList =  !readOnly && !readOnlyConfig[props.name] && (!!workgroupSelection[props.name] || (Array.isArray(entitlementData[props.name]) && entitlementData[props.name].length > 1));
      const initialApproverData = Array.isArray(originalData[props.name]) && originalData[props.name][0];
      const searchValue = (readOnly || readOnlyConfig[props.name]) ? (initialApproverData && (initialApproverData.label || initialApproverData.displayName)) : entitlementData[props.name];
      const isEntitlementAWorkgroup = !!(initialApproverData && initialApproverData.workgroup)
      const defaultValue = initialApproverData ? (initialApproverData.label || initialApproverData.displayName) : '';
      const initalOptionValue = {
        label: initialApproverData.displayName || initialApproverData.name,
        value: initialApproverData.id,
        id: initialApproverData.id,
        name: initialApproverData.name,
        workgroup: initialApproverData.workgroup
      }

      const approverReadOnly = !!(readOnly || readOnlyConfig[props.name]);

      return (
        <>
          <FormElement
            key={props.name}
            label={props.displayName}
            mode="multiple"
            value={searchValue}
            type='search-dropdown'
            onChange={(value, workgroupObj) => onChangeApprover(props.name, value, workgroupObj)}
            readOnly={approverReadOnly}
            error={!!showWorkgroupList ? '' : errors[props.name]}
            required={props.required}
            placeholder={messages.FORM.APPROVER_PLACEHOLDER}
            renderWorkgroupWithUsers={true}
            style={{ width: '100%' }}
            showSearch={true}
            isWorkgroup={isEntitlementAWorkgroup}
            fetchOptions={(userName) => fetchUserList(userName, true, currentWorkgroup || initalOptionValue)}
            defaultSearchValue={defaultValue}
            dataObject={approverReadOnly ? initalOptionValue : currentWorkgroup}
            initalOptionValue={initalOptionValue}
          />
          { loadingWorkgroupList[props.name] && (
            <div className="oe-workgroup-loader">
              <Spin spinning={loadingWorkgroupList[props.name]}></Spin>
            </div>
          )}
          {
            showWorkgroupList && (
              <FormElement
                value={workgroupStateData[props.name]}
                label={`${messages.FORM.WORKGROUP_LABEL} ${props.name.includes('2') ? '2' : '3'}`}
                type='workgroup'
                options={workgroupList}
                onChange={(value, workgroup) => handleWorkgroupChange(props.name, value, workgroup )}
                onCreate={workgroupInfo => handleCreateWorkgroup(workgroupInfo, props.name)}
                readOnly={readOnly}
                allUsers={[]}
                onItemAdd={(id) => handleWorkgroupMember('add', id, workgroupStateData[props.name], props.name)}
                onItemRemove={(id) => handleWorkgroupMember('remove', id, workgroupStateData[props.name], props.name)}
                error={errors[props.name]}
                allowedActions={workgroupAccess[props.name]}
                approverData={approverStateData[props.name]}
                fetchOptions={(userName) => fetchUserList(userName)}
                defaultSearchValue={defaultValue}
              />
            )
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
      // const approverLevel2_data = (Array.isArray(entitlementData.approverLevel2) && entitlementData.approverLevel2[0]?.id) ? [entitlementData.approverLevel2[0].id] : []
      if (originalData.approverLevel2) {
        onChangeApprover('approverLevel2', [originalData.approverLevel2[0].id], originalData.approverLevel2);
      }
    }
  }, [originalData.approverLevel2]);

  React.useEffect(() => {
    if (!readOnly) {
      // const approverLevel3_data = (Array.isArray(entitlementData.approverLevel3) && entitlementData.approverLevel3[0]?.id) ? [entitlementData.approverLevel3[0].id] : []
      if (originalData.approverLevel3) {
        onChangeApprover('approverLevel3', [originalData.approverLevel3[0].id], originalData.approverLevel3);
      }
    }
  }, [originalData.approverLevel3]);

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
