import React from "react";
import { Row, Col, message, Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import Button from '../../components/button';
import "./style.scss";
import Typography from "../../components/typography";
import Dropdown from "../../components/dropdown";
import { API, localMode } from "../../api";
import ExtendedAttributes from "./extended-attributes";
import extendedAttributesJSON from "../../data/extended-attributes.json";

const loadingIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;
const dropdownOptions = [
  {
    label: 'Application 1',
    value: 'app1'
  },
  {
    label: 'Application 2',
    value: 'app2'
  },
  {
    label: 'Application 3',
    value: 'app3'
  },
  {
    label: 'Application 4',
    value: 'app4'
  }
]

const constructDropdown = (data = []) => {
  const result = Array.isArray(data) && data.map(item => ({
    label: item,
    value: item
  }));

  return result;
}

const AdvancedSearchContent = ({ onClose, onSearch, searchData, onClear }) => {
  const [loading, setLoading] = React.useState(false);
  const [formData, setFormData] = React.useState({...searchData});
  const [applicationData, setApplicationData] = React.useState([]);
  const [attributeData, setAttributeData] = React.useState([]);
  const [valueData, setValueData] = React.useState([]);
  const [typeData, setTypeData] = React.useState([]);

  const [extendedAttributes, setExtendedAttributes] = React.useState([]);
  const [loadingExtendedAttr, setLoadingExtendedAttr] = React.useState(false);

  const updateFormData = (formKey, formValue) => {
    setFormData({
      ...formData,
      [formKey]: formValue
    });
  }

  const updateAdvanceSearchData = (formKey, formValue) => {
    switch (formKey) {
      case 'application':
        setApplicationData(formValue);
        break;
      case 'attribute':
        setAttributeData(formValue);
        break;
      case 'value':
        setValueData(formValue);
        break;
      case 'type':
        setTypeData(formValue);
        break;
      default:
        break;
    }
  }

  const callSearchAPI = (APIUrl, formKey) => {
    // console.log(formData.application);
    setLoading(true);
    const url = `EntitlementManagement/${APIUrl}`;
    if (formKey === 'application') {
      API.get(url).then(res => {
        if (Array.isArray(res.data)) {
          updateAdvanceSearchData(formKey, constructDropdown(res.data));
        }
      }).catch(err => {
        // message.error("Failed to load statistics");
        if (localMode) {
          updateAdvanceSearchData(formKey, dropdownOptions);
        }
      }).then(() => {
        setLoading(false);
      });
    } else {
      let payload = {
        application: formData.application
      }
      if (formKey === 'value') {
        payload.attribute = formData.attribute;
      }

      API.post(url, payload).then(res => {
        if (Array.isArray(res.data)) {
          updateAdvanceSearchData(formKey, constructDropdown(res.data));
        }
      }).catch(err => {
        // message.error("Failed to load statistics");
        if (localMode) {
          updateAdvanceSearchData(formKey, dropdownOptions);
        }
      }).then(() => {
        setLoading(false);
      });
    }
  }

  const getExtendedAttributes = () => {
    setLoadingExtendedAttr(true);
    const url = 'EntitlementManagement/extendedattributes';
    API.get(url).then(res => {
      if (Array.isArray(res.data)) {
        setExtendedAttributes(res.data);
      }
    }).catch(err => {
      // message.error("Failed to load statistics");
      if (localMode) {
        setExtendedAttributes(extendedAttributesJSON);
      }
    }).then(() => {
      setLoadingExtendedAttr(false);
    });
  }

  const handleUpdateFormData = (attrName, value) => {
    setFormData({
      ...formData,
      extendedAttributes: {
        ...formData.extendedAttributes,
        [attrName]: value
      }
    })
  }

  const handleAdvanceSearch = () => {
    // console.log(formData);
    onSearch(formData);
    onClose();
  }

  React.useEffect(() => {
    getExtendedAttributes();
    callSearchAPI('applications', 'application');
  }, []);

  React.useEffect(() => {
    if (formData.application) {
      callSearchAPI('entitlementattributes', 'attribute');
    }
    updateFormData('attribute', null);
  }, [formData.application]);

  React.useEffect(() => {
    if (formData.attribute) {
      callSearchAPI('entitlementvalues', 'value');
    }
    updateFormData('value', null);
  }, [formData.attribute]);

  React.useEffect(() => {
    setFormData({...searchData});
  }, [searchData]);

  return (
    <Spin spinning={loading}>
      <div className="oe-adv-search-content">
        <Typography type="title2" className="oe-overlay-header">Select Search Attribute Fileds</Typography>
        <Row>
          <Col md={6} style={{ margin: '4px 0' }}>
            <Dropdown
              options={applicationData}
              value={formData.application}
              onChange={(v, e) => updateFormData('application', v)}
              label="Application" />
          </Col>
          <Col md={6} style={{ margin: '4px 0' }}>
            <Dropdown 
            options={attributeData} 
            value={formData.attribute} 
            onChange={(v, e) => updateFormData('attribute', v)} 
            label="Attribute" 
            disabled={!formData.application} />
          </Col>
          <Col md={6} style={{ margin: '4px 0' }}>
            <Dropdown 
            options={valueData} 
            value={formData.value}
             onChange={(v, e) => updateFormData('value', v)} 
             label="Value" 
             disabled={!formData.attribute} />
          </Col>
          <Col md={6} style={{ margin: '4px 0' }}>
            <Dropdown 
            options={typeData} 
            value={formData.value}
             onChange={(v, e) => updateFormData('type', v)} 
             label="Type" 
             disabled={!formData.application} />
          </Col>
        </Row>
        <div className="divider"></div>
        <Typography type="body2" className="oe-overlay-subheader">Searchable Attributes</Typography>
        <Spin spinning={loadingExtendedAttr} indicator={loadingIcon}>
          <Row>
            {extendedAttributes.map(item => (
              <ExtendedAttributes selectedValues={formData.extendedAttributes} data={item} updateFormData={handleUpdateFormData} />
            ))}
          </Row>
        </Spin>
        <Row justify="end" className="oe-overlay-footer">
          <Button onClick={onClose}>Cancel</Button>
          <Button onClick={onClear}>Reset</Button>
          <Button type="primary" onClick={handleAdvanceSearch}>Apply</Button>
        </Row>
      </div>
    </Spin>
  )
}

export default AdvancedSearchContent;