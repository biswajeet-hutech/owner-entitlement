import React from "react";

import './style.scss';
import Tabs from "../../components/tab";
import EntitlementDetails from "../entitlement-details";
import EntitlementMembers from "../entitlement-members";
import { API2 as API } from "../../api";
import { message, Spin } from "antd";
import dummyData from "../../data/entitlement-details-dummy.json";

const EntitlementDetailsWrapper = ({
  entitlementId,
  defaultActiveKey="1",
  editMode
}) => {

  const defaultEntitlementList = {
    ExtentedAttributeProperties: {},
    EntitlementDetails: {},
    Members: [
      {
        total: 0,
        MemberDetails: []
      }
    ]
  }

  const [entitlementData, setEntitlementData] = React.useState({...defaultEntitlementList});
  const [loadingEntitlement, setLoadingEntitlement] = React.useState(false);

  const getEntitlementList = ({ totalRecordsToFetch, start, attrVal, id }) => {
    setLoadingEntitlement(true);
    const url = '/EntitlementManagement/members';
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
      // setEntitlementData({
      //   // total: entitlementList.total,
      //   // EntitlementDetails: []
      //   // ...data
      // })
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
    })
  }, []);

  const tabsData = [{
    name: 'Entitlement Members',
    content: (
      <Spin spinning={loadingEntitlement}>
        <EntitlementMembers data={entitlementData.Members[0]} onUpdate={handleOnMemberSearch} />
      </Spin>
    )
  }, {
    name: 'Entitlement Details',
    content: (
      <Spin spinning={loadingEntitlement}>
        <EntitlementDetails data={entitlementData} editMode={!!editMode} />
      </Spin>
    )
  }]
  return (
    <Tabs tabs={tabsData} filled defaultActiveKey={defaultActiveKey} />
  );
}

export default EntitlementDetailsWrapper;
