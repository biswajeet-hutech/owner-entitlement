import React from "react";
import { message, Spin } from "antd";

import EntitlementDetails from "../entitlement-details";
import EntitlementMembers from "../entitlement-members";
import { API, localMode } from "../../api";
import advanceEditableAttrJSON from "../../data/advance-editable-attributes.json";
import dummyData from "../../data/entitlement-details-dummy.json";
import './style.scss';

const EntitlementDetailsWrapper = ({
  entitlementId,
  entitlementName,
  entitlementDetailsHeader,
  defaultActiveKey="1",
  editMode,
  onClose = ()=> {},
  onEntitlementUpdate = ()=> {},
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
  const [entitlementMembersData, setEntitlementMembersData] = React.useState({...defaultEntitlementList});
  const [extendedAttributes, setExtendedAttributes] = React.useState([]);
  const [standardAttributes, setStandardAttributes] = React.useState([]);
  const [loadingEntitlement, setLoadingEntitlement] = React.useState(false);

  const entitlementDataWithExtProps = {
    ...entitlementData,
    ExtentedAttributeProperties: [...extendedAttributes]
  };

  const getExtendedAttribures = () => {
    const apiURL = !!editMode ? `/EntitlementManagement/advanceeditableattributes/${entitlementId}` : '/EntitlementManagement/viewableattributes';
    API.get(apiURL).then(response => {
      if (response.data) {
        setExtendedAttributes(response.data?.ExtendedAttributes || []);
        setStandardAttributes(response.data?.StandardAttributes || []);
      }
    }).catch(err => {
      if (localMode) {
        setExtendedAttributes(advanceEditableAttrJSON.ExtendedAttributes);
        setStandardAttributes(advanceEditableAttrJSON.StandardAttributes);
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
        setEntitlementMembersData({...res.data});
      }
    }).catch(err => {
      message.error("Failed to load entitlement data");
      if(localMode) {
        setEntitlementMembersData({ ...dummyData });
      }
    }).then(res => {
      setLoadingEntitlement(false);
    });
  }

  const getEntitlementDetails = ({ id }) => {
    setLoadingEntitlement(true);
    const url = `EntitlementManagement/EntitlementDetails/${id}`;
    API.get(url).then(res => {
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
    if (defaultActiveKey === "1") {
      //Memebers tab
      getEntitlementList({
        totalRecordsToFetch: 25,
        id: entitlementId,
        start: 0,
        attrVal: ''
      });
    } 
    if (defaultActiveKey === "2") {
      getEntitlementDetails({
        id: entitlementId
      });
      getExtendedAttribures();
    }
  }, []);

  const tabsData = [{
    name: 'Entitlement Members',
    content: (
      <Spin spinning={loadingEntitlement}>
        <EntitlementMembers
          data={entitlementMembersData?.Members[0]}
          id={entitlementId}
          onUpdate={handleOnMemberSearch}
          onEntitlementUpdate={onEntitlementUpdate}
          entitlementName={entitlementName}
          entitlementDetailsHeader={entitlementDetailsHeader}
        />
      </Spin>
    )
  }, {
    name: 'Entitlement Details',
    content: (
      <Spin spinning={loadingEntitlement}>
        <EntitlementDetails
          data={entitlementDataWithExtProps}
          extendedAttributes={extendedAttributes}
          standardAttributes={standardAttributes}
          editMode={!!editMode}
          onSuccess={onSuccess}
          onClose={() => {onClose(); onEntitlementUpdate();}}
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
