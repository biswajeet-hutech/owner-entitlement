import React from "react";
import { message, Select } from 'antd';
import './style.scss';
import { getFormType } from "../../utils";
import FormElement from "../../components/form-element";
import API, { localMode } from "../../api";

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
  const [approverStateData, setApproverStateData] = React.useState({approver_level2: null, approver_level3: null});
  const [workgroupStateData, setWorkgroupStateData] = React.useState({approver_level2: [], approver_level3: []});
  const [workgroupDetailsData, setWorkgroupDetailsData] = React.useState({approver_level2: [], approver_level3: []});
  const extendedPropsWithoutApprover =  Array.isArray(extendedProps) ? extendedProps.filter(item => !(['approval_levels', 'approver_level2', 'approver_level3'].includes(item.name))) : [];
  const extendedPropsWithApprover = Array.isArray(extendedProps) ? extendedProps.filter(item => (['approval_levels', 'approver_level2', 'approver_level3'].includes(item.name))) : [];

  const getApproverLevelData = async ({APIName, name}) => {
    API.get(APIName).then(res => {
      setApproverLevelData({ ...approverLevelData, [name]: res.data });
    }).catch(err => {
      if (localMode) {
        setApproverLevelData({
          ...approverLevelData,
          [name]: [
          {
            "workgroup": "true",
            "firstname": null,
            "name": "Test Work Group1",
            "id": "8a4057b3757a50f701757a547e820015",
            "email": "TestWorkGroup1@test.com",
            "lastname": null
          },
          {
            "workgroup": "false",
            "firstname": "Donald",
            "name": "200",
            "id": "8a405b8a75ae475f0175ae5825e1002e",
            "email": null,
            "lastname": "Byrd"
          },
          {
            "workgroup": "false",
            "firstname": "Casey",
            "name": "201",
            "id": "8a405b8a75ae475f0175ae5826b70030",
            "email": null,
            "lastname": "Bridges"
          },
          {
            "workgroup": "false",
            "firstname": "Wayne",
            "name": "202",
            "id": "8a405b8a75ae475f0175ae5826f70032",
            "email": null,
            "lastname": "Lopez"
          }
        ]
        });
      }
    })
  }

  const callWorkgroupDetailsAPI = (users, name) => {
    if (!users.length) {
      setWorkgroupDetailsData({
        ...workgroupDetailsData,
        [name]: []
      });
    } else {
      API.post('/EntitlementManagement/workgroup/assigned', {
        'identities': [...users]
      }).then(res => {
        setWorkgroupDetailsData({
          ...workgroupDetailsData,
          [name]: res.data
        });
        if (res.data && res.data[0]) {
          handleWorkgroupChange(name, res.data[0]);
        }
      }).catch(err => {
        if (localMode) {
          const response = {
            data: [
              "Approver Level1",
              "Approver Level2",
              "Approver Level3",
            ]
          }
          setWorkgroupDetailsData({
            ...workgroupDetailsData,
            [name]: response.data
          });
          if (response.data && response.data[0]) {
            handleWorkgroupChange(name, response.data[0]);
          }
        }
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
      readOnly: readOnly || props.name === 'approval_levels',
      error: errors[props.name],
      // required: ['input', 'dropdown'].includes(formType) && props.name !== 'approval_levels',
    }
  }) : [];

  const ext_props_with_approver = extendedPropsWithApprover.reduce((acc, item) => {
    acc[item.name] = item;
    return acc;
  }, {});

  const renderApproverLevel = (props) => {
    return (
      <FormElement
        key={props.name}
        label={props.displayName}
        value={entitlementData[props.name]}
        type='dropdown'
        options={props.allowedValues.map(item => ({ label: item, value: item }))}
        onChange={(value) => onChange(props.name, value)}
        readOnly={true}
        error={errors[props.name]}
        required={true}
      />
    )
  }

  const onChangeApprover = (key, val) => {
    let result = [];
    const workgroupKeys = approverLevelData[key].filter(item => item.workgroup === 'true').map(item => item.name);
    const selectedVal = approverLevelData[key].find(item => item.name === val[val.length - 1]) || {};
    if (selectedVal.workgroup === "true") {
      result.push(selectedVal.name);
      onChange(key, selectedVal.name);
    } else {
      if (val.some(item => workgroupKeys.includes(item))) {
        result.push(val[val.length - 1])
      } else {
        result = [...val];
      }
    }

    if(!val.length) {
      onChange(key, null);
    }

    callWorkgroupDetailsAPI(result, key);
    setApproverStateData({
      ...approverStateData,
      [key]: result
    })
  }

  const handleWorkgroupChange = (key, value) => {
    setWorkgroupStateData({
      ...workgroupStateData,
      [key]: value
    });
    onChange(key, value);
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
          message.success("Workgroup created");
          callWorkgroupDetailsAPI(approverStateData[approverLevel], approverLevel);
        }
      })
    }
  }

  const handleWorkgroupMember = (action, id, workgroupName) => {
    API.post('/EntitlementManagement/workgroup/update/members', {
      "name": workgroupName,
      "add": action === "add" ? [id] : null,
      "remove": action === "remove" ? [id] : null,
    }).then(response => {
      if (response.data.status === "success") {
        message.success(`Member ${action === "add" ? "added" : "removed"} Successfully`);
      } else {
        message.error("Unable to execute the action")
      }
    }).catch(error => {
      message.error("Unable to execute the action")
    })
  }

  const renderApproverLevel2_3 = (props) => {
    let workgroupList = Array.isArray(workgroupDetailsData[props.name]) ? workgroupDetailsData[props.name].map(item => ({
      label: item,
      value: item
    })) : [];

    let dropdownData = Array.isArray(approverLevelData[props.name]) ?  approverLevelData[props.name].map(item => ({
      label: item.firstname ? `${item.firstname} ${item.lastname}` : item.name,
      value: item.name,
      workgroup: item.workgroup === 'true'
    })) : [];

    let allMembersData = approverLevelData[props.name] && approverLevelData[props.name].filter(item => (item.workgroup !== "true" && !(approverStateData[props.name]?.includes(item.name))));
    const workgroupListMap = dropdownData.filter(item => item.workgroup).map(item => item.value);
    const isWorkgroupSelected = !!(approverStateData[props.name] && approverStateData[props.name][0] && workgroupListMap.includes(approverStateData[props.name][0]));
    // console.log(workgroupListMap);
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
      // <>
      //   <FormElement
      //     key={props.name}
      //     label={props.displayName}
      //     value={approverStateData[props.name]}
      //     type='chip_dropdown'
      //     options={dropdownData}
      //     onChange={(value) => onChangeApprover(props.name, value)}
      //     readOnly={readOnly}
      //     error={errors[props.name]}
      //     required={true}
      //     placeholder={'Select a workgroup or list of members as approver'}
      //     renderOptions={renderOptions()}
      //   />
      //   {
      //     !!approverStateData[props.name]?.length && !isWorkgroupSelected && (
      //       <FormElement
      //         value={workgroupStateData[props.name]}
      //         label={`Associated Workgroup for Approver Level ${props.name.includes('2') ? '2' : '3'}`}
      //         type='workgroup'
      //         options={workgroupList}
      //         onChange={(value) => handleWorkgroupChange(props.name, value )}
      //         onCreate={workgroupInfo => handleCreateWorkgroup(workgroupInfo, props.name)}
      //         readOnly={readOnly}
      //         // required={true}
      //         allUsers={allMembersData}
      //         onItemAdd={(id) => handleWorkgroupMember('add', id, workgroupStateData[props.name])}
      //         onItemRemove={(id) => handleWorkgroupMember('remove', id, workgroupStateData[props.name])}
      //         error={!workgroupList.length ? 'Oops, no common workgroup found for these users. Create a workgroup to add them.' : ''}
      //       />
      //     )
      //   }
      // </>
        <FormElement
          key={props.name}
          label={props.displayName}
          value={entitlementData[props.name]}
          type='input'
          // options={dropdownData}
          onChange={(value) => onChangeApprover(props.name, value)}
          readOnly={true}
          error={errors[props.name]}
          required={true}
          placeholder={'Select a workgroup or list of members as approver'}
          renderOptions={renderOptions()}
        />
    )
  }

  // React.useEffect(() => {
  //   if (ext_props_with_approver.approver_level2) {
  //     getApproverLevelData(ext_props_with_approver.approver_level2);
  //   }
  // }, [ext_props_with_approver.approver_level2]);

  // React.useEffect(() => {
  //   if (ext_props_with_approver.approver_level2 && entitlementData.approval_levels > "1" && !approverLevelData.approver_level2) {
  //     // console.log("came here");
  //     getApproverLevelData(ext_props_with_approver.approver_level2);
  //   }

  //   if (ext_props_with_approver.approver_level3 && entitlementData.approval_levels > "2" && !approverLevelData.approver_level3) {
  //     // console.log("came here");
  //     getApproverLevelData(ext_props_with_approver.approver_level3);
  //   }
    
  // }, [entitlementData.approval_levels]);

  // React.useEffect(() => {
  //   if (entitlementData) {
  //     if (!approverStateData.approver_level2) {
  //       setApproverStateData({
  //         ...approverStateData,
  //         approver_level2: entitlementData.approver_level2 ? [entitlementData.approver_level2] : []
  //       });
  //     }

  //     if (!approverStateData.approver_level3) {
  //       setApproverStateData({
  //         ...approverStateData,
  //         approver_level3: entitlementData.approver_level3 ? [entitlementData.approver_level3] : []
  //       });
  //     }
      
  //   }
  // }, [entitlementData]);

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
