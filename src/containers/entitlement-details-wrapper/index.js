import React from "react";
import { message, Spin } from "antd";

import EntitlementDetails from "../entitlement-details";
import EntitlementMembers from "../entitlement-members";
import { API, localMode } from "../../api";
import extendedAttributesDummyData from "../../data/extended-attributes.json";
import dummyData from "../../data/entitlement-details-dummy.json";
import './style.scss';

const EntitlementDetailsWrapper = ({
  entitlementId,
  entitlementName,
  defaultActiveKey="1",
  editMode,
  onClose = ()=> {},
  onSuccess = ()=> {}
}) => {

  const defaultEntitlementList = {
    EntitlementDetails: {},
    Members: [
      {
        total: 0,
        MemberDetails: []
      }
    ]
  }

  const [entitlementData, setEntitlementData] = React.useState({...defaultEntitlementList});
  const [extendedAttributes, setExtendedAttributes] = React.useState([]);
  const [loadingEntitlement, setLoadingEntitlement] = React.useState(false);
  const entitlementPropData = {
    ...entitlementData,
    ExtentedAttributeProperties: [...extendedAttributes]
  };

  const getExtendedAttribures = () => {
    const apiURL = !!editMode ? '/EntitlementManagement/editableattributes' : '/EntitlementManagement/viewableattributes';
    API.get(apiURL).then(response => {
      if (response.data) {
        setExtendedAttributes(response.data);
      }
    }).catch(err => {
      if (localMode) {
        setExtendedAttributes([...extendedAttributesDummyData]);
      }
    })
  }

  const getEntitlementList = ({ totalRecordsToFetch, start, attrVal, id }) => {
    setLoadingEntitlement(true);
    const url = 'EntitlementManagement/members';
    API.post(url, {
      PagingInfo: {
        totalRecordsToFetch: totalRecordsToFetch+'',
        start: start+''
      },
      attrVal,
      id
    }).then(res => {
      if (res.data) {
        setEntitlementData({...res.data});
      }
    }).catch(err => {
      message.error("Failed to load entitlement data");
      if(localMode) {
        setEntitlementData({ ...dummyData });
      }
    }).then(res => {
      setLoadingEntitlement(false);
    });
  }

  const handleOnMemberSearch = ({totalRecordsToFetch, start, attrVal}) => {
    // console.log(searchVal);
    getEntitlementList({
      totalRecordsToFetch,
      start,
      attrVal,
      id: entitlementId
    })
  }

  React.useEffect(() => {
    getEntitlementList({
      totalRecordsToFetch: 25,
      id: entitlementId,
      start: 0,
      attrVal: ''
    });
    if (defaultActiveKey === "2") {
      getExtendedAttribures();
    }
  }, []);

  const tabsData = [{
    name: 'Entitlement Members',
    content: (
      <Spin spinning={loadingEntitlement}>
        <EntitlementMembers data={entitlementData.Members[0]} id={entitlementId} onUpdate={handleOnMemberSearch} entitlementName={entitlementName} />
      </Spin>
    )
  }, {
    name: 'Entitlement Details',
    content: (
      <Spin spinning={loadingEntitlement}>
        <EntitlementDetails
          data={entitlementPropData}
          extendedAttributes={extendedAttributes}
          editMode={!!editMode}
          onSuccess={onSuccess}
          onClose={onClose}
        />
      </Spin>
    )
  }]

  return (
    // <Tabs tabs={tabsData.filter((tab, index) => index+1 === +defaultActiveKey)} filled defaultActiveKey={defaultActiveKey} />
    tabsData[+defaultActiveKey-1].content
  );
}

export default EntitlementDetailsWrapper;
