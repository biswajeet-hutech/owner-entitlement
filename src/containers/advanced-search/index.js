import React from "react";
import { Popover, Badge } from 'antd';
import {SettingIcon} from './../../assets'
import Button from '../../components/button';
import "./style.scss";
import AdvancedSearchContent from "./advance-search-content";

const defaultSearchData = {
  application: null,
  attribute: null,
  value: null,
  extendedAttributes: {}
};

const AdvancedSearch = ({ onSearch }) => {
  const [showAdvancedContent, setShowAdvancedContent] = React.useState(false);
  const [searchData, setSearchData] = React.useState({...defaultSearchData});

  const hideContent = () => {
    setShowAdvancedContent(false);
  };

  const handleVisibleChange = visible => {
    setShowAdvancedContent(visible);
  };

  const handleAdvanceSearch = (advSearchData) => {
    setSearchData({...advSearchData});
    const payload = {
      applications: advSearchData.application ? [advSearchData.application] : null,
      attribute: advSearchData.attribute,
      value: advSearchData.value,
      ...advSearchData.extendedAttributes
    };

    onSearch(payload);
  }

  const filterCount = () => {
    console.log(searchData);
    const count = (searchData.application ? 1 : 0) + (searchData.attribute ? 1 : 0) + (searchData.value ? 1 : 0) + (Object.keys(searchData?.extendedAttributes).filter(item => searchData?.extendedAttributes[item])).length;
    
    return count;
  }

  const handleClearData = () => {
    handleAdvanceSearch({...defaultSearchData});
  }

  return (
    <div className="oe-adv-search">
      <Popover
        content={<AdvancedSearchContent 
        onClose={hideContent} 
        onSearch={handleAdvanceSearch} 
        searchData={searchData} 
        onClear={handleClearData} />}
        title=""
        trigger="click"
        visible={showAdvancedContent}
        onVisibleChange={handleVisibleChange}
        className="oe-popover"
        placement="bottomRight"
        autoAdjustOverflow={false}
        style={{top:"300px",left:"40px"}}
        arrowPointAtCenter={true}
        overlayClassName="oe-overlay"
        arrowContent={null}
        destroyTooltipOnHide
      >
        <Badge count={filterCount()} style={{ backgroundColor: '#d42511' }}>
          <Button type="primary" leftIcon={<SettingIcon />} className="adv-btn-wrapper">Advanced Search</Button>
        </Badge>
      </Popover>
    </div>
  );
}

export default AdvancedSearch;
