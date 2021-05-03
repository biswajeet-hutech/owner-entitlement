import React from "react";
import { Row, Spin, message } from "antd";
// import { getFormType } from "../../utils";
import Button from "../../components/button";
import './style.scss';
import FormElement from "../../components/form-element";
import ExtendedProperties from "./extended-properties";
import { messages } from "../../assets";
import API, { localMode } from "../../api";
import SelfReview from "./self-review";

const modifyEntitlementData = (data) => {
  const res = JSON.parse(JSON.stringify(data));
  if (data.approverLevel2) {
    const key = 'approverLevel2';
    if (Array.isArray(data[key])) {
      if (data[key].length && typeof data[key][0] === "object") {
        res[key] = data[key].map(item => item.id);
      }
    } else {
      res[key] = [];
    }
  } else {
    res.approverLevel2 = [];
  }

  if (data.approverLevel3) {
    const key = 'approverLevel3';
    if (Array.isArray(data[key])) {
      if (data[key].length && typeof data[key][0] === "object") {
        res[key] = data[key].map(item => item.id);
      }
    } else {
      res[key] = [];
    }
  } else {
    res.approverLevel3 = [];
  }

  return res;
}

const BaseProperties = ({
  data={
    EntitlementDetails: {},
    ExtentedAttributeProperties: []
  },
  standardAttributes = [],
  extendedAttributes = [],
  readOnly,
  setActions=(ele)=>{},
  onSave=()=>{},
  onCancel=()=>{},
  onSuccess=()=>{},
}) => {
  const [entitlementData, setEntitlementData] = React.useState(modifyEntitlementData(data.EntitlementDetails || {}));
  const [formData, setFormData] = React.useState({});
  const [loading, setLoading] = React.useState(false);
  const [errors, setErrors] = React.useState({});
  const readOnlyProperties = ['application', 'value', 'lastrefresh', 'modified'];
  const requiredProps = [];
  const isEntitlementReviewed = !!((data.EntitlementDetails || {}).ReviewStatus === "Complete");
  const readOnlyConfig = extendedAttributes?.reduce((acc, item) => {
    acc[item.name] = item.readOnly;
    return acc;
  }, {})

  const handleUpdate = (key, value) => {
    const updatedObj = {
      [key]: value
    }

    if (key === 'approvalLevels') {
      if (!value || value === '1') {
        updatedObj.approverLevel2 = null;
        updatedObj.approverLevel3 = null;
      }
      if (value === '2') {
        updatedObj.approverLevel3 = null;
      }
    }

    setFormData(stateData => (
      modifyEntitlementData({
        ...stateData,
        ...updatedObj
      })
    ));

    setEntitlementData(stateData => (
      modifyEntitlementData({
        ...stateData,
        ...updatedObj
      })
    ));
  }

  const getErrors = (formData) => {
    const errorObj = {};
    requiredProps.forEach(item => {
      if (!entitlementData[item]) {
        errorObj[item] = messages.FORM.REQUIRED;
      }
    })

    const approverKeys = [];
    if (entitlementData.approvalLevels > "1" && !readOnlyConfig.approverLevel2) {
      approverKeys.push("approverLevel2");
    }
    if (entitlementData.approvalLevels > "2" && !readOnlyConfig.approverLevel3) {
      approverKeys.push("approverLevel3")
    }

    approverKeys.forEach(item => {
      if (!formData[item]) {
        errorObj[item] = messages.FORM.REQUIRED;
      } else if (Array.isArray(formData[item]) && formData[item]?.length > 1) {
        errorObj[item] = messages.FORM.SELECT_WORKGROUP;
      } else if (Array.isArray(formData[item]) && !formData[item].length) {
        errorObj[item] = messages.FORM.SELECT_APPROVER;
      }
    })

    return errorObj;
  }

  const readOnlyFormConfig = [
    {
      key: 'application',
      label: 'Application',
      value: entitlementData.application,
      type: 'input',
      readOnly: true
    },
    {
      key: 'value',
      label: 'Value',
      value: entitlementData.value,
      type: 'input',
      readOnly: true
    },
  ];

  const userActionSectionData = [
    {
      key: 'lastrefresh',
      label: 'Refreshed On',
      value: entitlementData.lastrefresh,
      type: 'input',
      readOnly: true
    },
    {
      key: 'modified',
      label: 'Updated On',
      value: entitlementData.modified,
      type: 'input',
      readOnly: true
    },
  ]

  const getStandardFormConfig = {
    displayName: {
      type: 'textarea',
      maxLength: 450,
      autoSize: true
    },
    requestable: {
      type: 'checkbox'
    },
    description: {
      type: 'description',
      defaultValue: data.EntitlementDetails.description,
    }
  }

  const standardFormConfig = standardAttributes.map(attr => ({
    ...getStandardFormConfig[attr.name],
    key: attr.name,
    label: attr.displayName,
    type: getStandardFormConfig[attr.name]?.type || attr.type,
    value: entitlementData[attr.name],
    readOnly: readOnly || attr.readOnly,
    onChange: (value) => handleUpdate(attr.name, value),
    error: errors[attr.name]
  }))

  const handleSaveData = () => {
    const finalFormData = {...formData};
    const errors = getErrors(finalFormData);
    const inValidForm = Object.keys(errors).length;
    setErrors(errors);

    if (inValidForm) {
      return;
    } else {
      const payload = {};
      for (const key in finalFormData) {
        if(!readOnlyProperties.includes(key)) {
          if (["approverLevel2", "approverLevel3"].includes(key) && Array.isArray(finalFormData[key])) {
            payload[key] = finalFormData[key].join();
          } else {
            payload[key] = finalFormData[key];
          }
        }
      }
      onSave(payload);
    }
  }

  const updateReviewState = ({ entitlementid, comment, status }) => {
    const APIUrl = `/EntitlementManagement/review/update`;
    setLoading(true);
    API.post(APIUrl, {
      entitlementid,
      comment,
      status
    }).then(response => {
      try {
        if (response.data.status === "success") {
          message.success('Review status updated.');
          onSuccess();
        }
      } catch(e) {
        message.error('Something went wrong, please try again.');
      }
    }).catch(e => {
      message.error('Something went wrong, please try again.');
      if(localMode) {
        onSuccess();
      }
    }).finally(() => {
      setLoading(false);
    })
  }

  React.useEffect(() => {
    const errorObj = getErrors({ ...formData });
    setErrors(stateData => errorObj);
  }, [formData]);

  React.useEffect(() => {
    setEntitlementData(modifyEntitlementData(data.EntitlementDetails || {}));
    if(!readOnly) {
      setActions(
        (
          <>
            <Row justify="end" className="accordion_footer">
              <Button type="secondary" size="large" className="cancel" onClick={onCancel}>{messages.CANCEL_BTN}</Button>
              <Button type="primary" size="large" className="save" onClick={handleSaveData}>{messages.SAVE}</Button>
            </Row>
          </>
        )
      )
    }
  }, [data]);

  return (
    <>
      <div className="form-section form-section-readonly">
      {
        readOnlyFormConfig.map(formElement => <FormElement {...formElement} />)
      } 
      </div>
      <div className="form-section form-section-writable">
      {
        standardFormConfig.map(formElement => <FormElement {...formElement} />)
      }
      </div>
      <ExtendedProperties
        originalData={data.EntitlementDetails}
        entitlementData={entitlementData}
        extendedProps={extendedAttributes}
        readOnly={readOnly}
        onChange={handleUpdate}
        errors={errors}
        onEntityLoad={(flag) => setLoading(!!flag)}
      />
      <div className="form-section form-section-readonly form-top-border">
        {
          userActionSectionData.map(formElement => <FormElement {...formElement} />)
        }
      </div>
      {
        readOnly && entitlementData?.id && (
          <SelfReview
            isEntitlementReviewed={isEntitlementReviewed}
            entitlementid={entitlementData?.id}
            updateReviewState={updateReviewState}
          />
        )
      }
      
      {
        !readOnly && (
        <Spin spinning={!!loading}>
          <Row justify="end" className="accordion_footer">
            <Button type="secondary" size="large" className="cancel" onClick={onCancel}>{messages.CANCEL_BTN}</Button>
            <Button type="primary" size="large" className="save" onClick={handleSaveData}>{messages.SAVE}</Button>
          </Row>
        </Spin>
        )
      }
    </>
  );
}

export default React.memo(BaseProperties);