import React from "react";
import { Col, Row, Popover, message, Spin, Popconfirm, Alert } from "antd";
import { CloseOutlined } from "@ant-design/icons";

import Button from "../../components/button";
import Table from "../../components/table";
import Typography from "../../components/typography";
import Search from "../../components/search";
import entitlementJSON from "../../data/entitlement-members-attribute.json";
import exportJSON from "../../data/export-entitlement.json";
import { API, localMode } from "../../api";
import "./style.scss";
import {
  ExportsIcon,
  ExportHoverIcon,
  InfoIcon,
  ApprovedIcon,
  RevokedIcon,
  NotCertifiedIcon,
  OpenIcon,
  PendingIcon,
  InfoHoverIcon,
  strings,
  CloseIcon,
} from "./../../assets";
import { getExportMembersFileName } from "../../utils";
import ExportButton from "../../components/button/export-btn";
import { printToPDF } from "../../utils/exportToPdf";
import { getCombinedCSVData } from "../../utils/multiple-csv";

const UserStatus = ({ status }) => {
  let isActive = status.toLowerCase() === "active";
  return (
    <div className={`userStatus_${isActive ? "active" : "disable"}`}>
      <div>{`${status}`}</div>
    </div>
  );
};

const CertificationStatus = ({ status }) => {
  switch (status.toLowerCase()) {
    case "approved":
      return (
        <div className={`certificationStatus ${status.toLowerCase()}`}>
          <ApprovedIcon alt={status} /> <span>{status}</span>
        </div>
      );
    case "revoked":
      return (
        <div className={`certificationStatus ${status.toLowerCase()}`}>
          <RevokedIcon alt={status} /> <span>{status}</span>
        </div>
      );
    case "open":
      return (
        <div className={`certificationStatus ${status.toLowerCase()}`}>
          <OpenIcon alt={status} /> <span>{status}</span>
        </div>
      );
    case "pending":
      return (
        <div className={`certificationStatus ${status.toLowerCase()}`}>
          <PendingIcon alt={status} /> <span>{status}</span>
        </div>
      );
    case "not certified":
      return (
        <div className={`certificationStatus ${status.toLowerCase()}`}>
          <NotCertifiedIcon alt={status} /> <span>{status}</span>
        </div>
      );
    default:
      return (
        <div className={`certificationStatus revoked`}>
          <RevokedIcon alt={status} /> <span>{status}</span>
        </div>
      );
  }
};

const headerConfig = {
  name: {
    title: "Name",
    dataIndex: "name",
    render: (text, record) => (record.name ? <span>{record.name}</span> : "—"),
  },
  status: {
    title: "User Status",
    dataIndex: "status",
    render: (text, record) => <UserStatus status={record.status} />,
  },
  certificationaction: {
    title: "Certification Action",
    dataIndex: "certificationaction",
    width: "180px",
    render: (text, record) => (
      <CertificationStatus status={record.certificationaction} />
    ),
  },
};

const EntitlementMembers = ({
  data = {},
  id,
  entitlementName = "",
  entitlementDetailsHeader,
  onUpdate,
  onEntitlementUpdate
}) => {
  const [visibleDeletePopup, setVisibleDeletePopup] = React.useState(false);
  const [showRemoveSuccessMessage, setShowRemoveSuccessMessage] = React.useState(false);
  const [entitlementHeaders, setEntitlementHeaders] = React.useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = React.useState([]);
  const [keysMarkedForDeletion, setKeysMarkedForDeletion] = React.useState([]);
  const [loadingEntitlement, setLoadingEntitlement] = React.useState(false);
  const [paginationConfig, setPaginationConfig] = React.useState({
    totalRecordsToFetch: 25,
    start: 1,
  });

  const showPopconfirm = () => {
    setVisibleDeletePopup(true);
  };

  const handleOk = () => {
    setLoadingEntitlement(true);
    setVisibleDeletePopup(false);
    API.post('/EntitlementManagement/member/update', {
      id: id,
      operation: "Remove",
      users: selectedRowKeys
    }).then(response => {
      if (response?.data?.status === "success") {
        message.success('Member removal process is successfully initiated');
        onUpdate({
          totalRecordsToFetch: paginationConfig.totalRecordsToFetch,
          start: paginationConfig.start,
          attrVal: paginationConfig.attrVal || "",
        });
        const keySetForDeletion = [...keysMarkedForDeletion, ...selectedRowKeys];
        setSelectedRowKeys([]);
        setTimeout(() => {
          setKeysMarkedForDeletion(keySetForDeletion);
          onEntitlementUpdate();
        }, 1000);
        setShowRemoveSuccessMessage(true);
      } else {
        message.error('Unable to remove members at this moment');
      }
    }).catch(err => {
      message.error('Unable to remove members at this moment');
      if (localMode) {
        message.success('Member removal process is successfully initiated');
        setShowRemoveSuccessMessage(true);
        onUpdate({
          totalRecordsToFetch: paginationConfig.totalRecordsToFetch,
          start: paginationConfig.start,
          attrVal: paginationConfig.attrVal || "",
        });
        const keySetForDeletion = [...keysMarkedForDeletion, ...selectedRowKeys];
        setSelectedRowKeys([]);
        setTimeout(() => {
          setKeysMarkedForDeletion(keySetForDeletion);
          onEntitlementUpdate();
        }, 1000);
      }
    }).then(() => {
      setLoadingEntitlement(false);
    });
  };

  const handleCancel = () => {
    setVisibleDeletePopup(false);
  };

  const handleUpdateSearchResult = ({ page, pageSize, attrVal }) => {
    setPaginationConfig({
      totalRecordsToFetch: pageSize || 25,
      start: page || 1,
      attrVal: attrVal
    });

    const totalRecordsToFetch = pageSize || 25;
    const start = page ? page - 1 : 0;

    onUpdate({
      totalRecordsToFetch: totalRecordsToFetch + "",
      start: start * totalRecordsToFetch + "",
      attrVal: attrVal || "",
    });
  };

  const getEntitlementHeaders = () => {
    const url = "EntitlementManagement/memberattributes";
    API.get(url)
      .then((res) => {
        if (Array.isArray(res.data)) {
          setEntitlementHeaders([...res.data]);
        }
      })
      .catch((err) => {
        message.error("Failed to load headers");
        if (localMode) {
          setEntitlementHeaders([...entitlementJSON]);
        }
      });
  };

  const prepareExportData = (data, exportType) => {
    if (exportType === "pdf") {
      printToPDF({
        exportData: data,
        options: {
          hideDetailsHeader: true
        },
        membersHeader: entitlementHeaders,
        detailsHeader: entitlementDetailsHeader,
        filename: "Entitlement-Member-Details"
      });
    } else {
      getCombinedCSVData({ data: data, membersHeader: entitlementHeaders, detailsHeader: entitlementDetailsHeader  });
    }
  }

  const exportAPI = (entitlementID, type) => {
    setLoadingEntitlement(true);
    API.get(`EntitlementManagement/exportmember/${entitlementID}`)
    .then((response) => {
      try {
        const exportData = { ...response.data };
        prepareExportData(exportData, type);
      } catch(e) {
        message.error("Unable to export at this moment");
      }
    })
    .catch((error) => {
      // error
      console.log(error);
      message.error("Something went wrong!");
      if (localMode) {
        try {
          prepareExportData(exportJSON, type);
        } catch(e) {
          message.error("Unable to export at this moment");
        }
      }
    })
    .then(() => {
      setLoadingEntitlement(false);
      // always executed
    });
  }

  const columns = [
    ...entitlementHeaders.map((item) => ({
      title: item.displayName,
      dataIndex: item.name,
      width: item.width ? item.width : undefined,
      render: (text, record) => record[item.name] || "",
      className: item.className || "",
      ...(headerConfig[item.name] || {}),
    })),
  ];

  React.useEffect(() => {
    getEntitlementHeaders();
  }, []);

  const rowSelection = {
    selectedRowKeys: selectedRowKeys,
    onChange: (rowKeys, selectedRows) => {
      setSelectedRowKeys([...rowKeys]);
    },
    getCheckboxProps: (record) => ({
      disabled: keysMarkedForDeletion.includes(record.name), // Column configuration not to be checked
      name: record.name,
    }),
    type: "checkbox"
  };

  return (
    <Spin spinning={loadingEntitlement}>
      <Row justify="space-between" className="oe-sc-row-padding">
      {showRemoveSuccessMessage ? (
          <Alert message="Request to remove membership is submitted successfully. Go to My Work --> Access Requests, to check the status of request" type="success" closable afterClose={() => setShowRemoveSuccessMessage(false)} />
        ) : null}
      </Row>
      <Row justify="space-between" className="oe-sc-row-padding">
        <Col md={10}>
          <Search
            placeHolder={strings.entitlement_members_search_placeholder}
            onSearch={(v) => handleUpdateSearchResult({ attrVal: v })}
          />
        </Col>
        <Col>
          <Popconfirm
            title={(
              <div>
                <p>Are you sure to remove these members?</p>
                <ol className="selected-members-list">
                  {
                    selectedRowKeys.map(item => <li>{item}</li>)
                  }
                </ol>
              </div>
            )}
            visible={visibleDeletePopup}
            onConfirm={handleOk}
            onCancel={handleCancel}
            placement="bottom"
            okText="Yes"
            cancelText="No"
          >
            <Button type="primary" onClick={showPopconfirm} disabled={!selectedRowKeys.length}>
              Remove Members
            </Button>
          </Popconfirm>

          <ExportButton onClick={(type) => exportAPI(id, type)} tooltip="Export Members" />
        </Col>
      </Row>
      <Row className="oe-sc-row-padding">
        <Table
          dataSource={data.MemberDetails || []}
          columns={columns}
          config={{
            scroll:{ y: '40vh', x: 1500 },
            size: 'small',
            pagination: {
              total: data.total,
              current: paginationConfig.start,
              onChange: (p, ps) =>
                handleUpdateSearchResult({ page: p, pageSize: ps }),
              position: ["none", "bottomCenter"],
              pageSizeOptions: [25, 50, 100],
              defaultPageSize: 25,
              showSizeChanger: true,
            },
            className: "oe-table oe-members-table",
            rowKey: "name",
            rowSelection: rowSelection
          }}
        />
      </Row>
    </Spin>
  );
};

export default EntitlementMembers;
