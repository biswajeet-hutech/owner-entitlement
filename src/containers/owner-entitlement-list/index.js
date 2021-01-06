import React from "react";
import { CheckCircleFilled, StopOutlined } from '@ant-design/icons';

import Table from '../../components/table';
import Modal from '../../components/modal';
import CardWrapper from './card-wrapper';
import ResponsiveActionIcons from './responsive-action-icons';
import EntitlementDetailsWrapper from "../entitlement-details-wrapper";
import SearchWithActionBar from "./search-with-action-bar";
import { API2 as API } from "../../api";

import "./style.scss";
import data from "../../data/entitlment-dummy.json";
import statisticsData from "../../data/entitlement-statistics-dummy.json";
import { message, Spin } from "antd";

const OwnerEntitlement = () => {
  const tablePaginationConfig = {
    pageSizeOptions: [25, 50, 100],
    defaultPageSize: 25
  };

  const defaultEntitlementList = {
    total: 0,
    EntitlementDetails: []
  }

  const [showMembersModal, setShowMembersModal] = React.useState({show: false, data: {}});
  const [entitlementList, setEntitlementList] = React.useState({...defaultEntitlementList});
  const [entitlementStatistics, setEntitlementStatistics] = React.useState([]);
  const [loadingEntitlement, setLoadingEntitlement] = React.useState(false);

  const getEntitlementList = ({ totalRecordsToFetch, start, searchVal }) => {
    setLoadingEntitlement(true);
    const url = '/EntitlementManagement/EntitlmentDetails';
    API.post(url, {
      PagingInfo: {
        totalRecordsToFetch: totalRecordsToFetch+'',
        start: start+''
      },
      searchVal
    }).then(res => {
      if (res.data) {
        setEntitlementList({...res.data});
      }
      // setEntitlementList({...data}); //Remove this code later
    }).catch(err => {
      message.error("Failed to load entitlement data");
      setEntitlementList({
        // total: entitlementList.total,
        // EntitlementDetails: []
        ...data
      })
    }).then(res => {
      setLoadingEntitlement(false);
    });
  }

  const getEntitlementStatistics = () => {
    const url = '/EntitlementManagement/Statistics';
    API.get(url).then(res => {
      if (Array.isArray(res.data)) {
        setEntitlementStatistics([...res.data]);
      }
    }).catch(err => {
      message.error("Failed to load statistics");
    });
  }

  React.useEffect(() => {
    getEntitlementList({
      totalRecordsToFetch: tablePaginationConfig.defaultPageSize,
      start: 0
    });
    getEntitlementStatistics();
  }, []);

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
    },
    getCheckboxProps: (record) => ({
      disabled: record.name === 'Disabled User',
      // Column configuration not to be checked
      name: record.name,
    }),
  };

  const handleSearchEntitlement = (searchVal="") => {
    getEntitlementList({
      totalRecordsToFetch: tablePaginationConfig.defaultPageSize,
      start: 0,
      searchVal: searchVal.trim()
    });
  }

  const columns = [
    {
      title: 'Entitlement Value',
      dataIndex: 'value',
      fixed: 'left',
    },
    {
      title: 'Application Name',
      dataIndex: 'application',
    },
    {
      title: 'Value',
      dataIndex: 'value',
    },
    {
      title: 'Display Name',
      dataIndex: 'displayName',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      render: (text) => (<div dangerouslySetInnerHTML={{__html: text}} className="oe-td-description" />)
    },
    {
      title: 'Requestable',
      dataIndex: 'requestable',
      align: 'center',
      render: (text) => text === "true" ? <CheckCircleFilled style={{ fontSize: 16, color: '#37ae22' }} /> : <StopOutlined style={{ fontSize: 16, color: '#c1c1c1' }} />
    },
    {
      title: 'Member',
      dataIndex: 'users',
      render: (text, record) => <a onClick={() => setShowMembersModal({show: true, data: {...record} })}>{`${text} Member${text > 1 ? 's' : ''}`}</a>
    },
    {
      title: 'Action',
      dataIndex: 'action',
      fixed: 'right',
      render: (text, record) => <ResponsiveActionIcons data={record}  />
    },
  ];

  const handlePageChange = (page, pageSize) => {
    console.log(page, pageSize);
    getEntitlementList({ totalRecordsToFetch: pageSize, start: page - 1 });
  }

  return (
    <>
      <CardWrapper cardData={entitlementStatistics} />
      <Spin spinning={loadingEntitlement}>
        <div className="table-filter-wrapper">
          <SearchWithActionBar onSearch={handleSearchEntitlement} />
          <Table
            dataSource={entitlementList.EntitlementDetails}
            columns={columns}
            config={{
              pagination: {
                total: entitlementList.total,
                onChange: handlePageChange,
                position: ['none', 'bottomCenter'], pageSizeOptions: tablePaginationConfig.pageSizeOptions, defaultPageSize: tablePaginationConfig.defaultPageSize, showSizeChanger: true },
              className: "oe-table oe-entitlement-list-table",
              rowKey: 'id',
              tableLayout: "fixed",
              scroll: { x: 1500 },
              rowSelection: {
                ...rowSelection,
              }
            }}
            />
        </div>
      </Spin>
      <Modal open={showMembersModal.show} onHide={() => setShowMembersModal({ show: false, data: {}})} title={`${showMembersModal.data.displayName || showMembersModal.data.value} - Entitlement Members`}>
        <EntitlementDetailsWrapper defaultActiveKey="1" entitlementId={showMembersModal.data.id} />
      </Modal>
    </>
  );
}

export default OwnerEntitlement;
