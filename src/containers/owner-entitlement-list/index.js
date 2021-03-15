import React from "react";
import { message, Spin } from "antd";
import { useJsonToCsv } from 'react-json-csv';
import Table from '../../components/table';
import Modal from '../../components/modal';
import CardWrapper from './card-wrapper';
import ResponsiveActionIcons from './responsive-action-icons';
import EntitlementDetailsWrapper from "../entitlement-details-wrapper";
import SearchWithActionBar from "./search-with-action-bar";
import { API, localMode } from "../../api";
import { CheckTrue } from './../../assets';
import { CheckFalse } from './../../assets';

import "./style.scss";
import data from "../../data/entitlment-dummy.json";
import exportAllEntitlementData from "../../data/export-all-entitlement.json";
import extendedAttributesJSON from "../../data/extended-attributes.json";
import entitlementHeadersData from "../../data/entitlement-headers.json";
import helpDataJSON from "../../data/helpdata.json";
import statisticsData from "../../data/entitlement-statistics-dummy.json";
import { getExportMembersFileName, titleCase } from "../../utils";
import Button from "../../components/button";
import { printToPDF } from "../../utils/exportToPdf";
import { getCombinedCSVData } from "../../utils/multiple-csv";

const OwnerEntitlement = () => {
  const tablePaginationConfig = {
    pageSizeOptions: [25, 50, 100],
    defaultPageSize: 25
  };

  const defaultEntitlementList = {
    total: 0,
    EntitlementDetails: []
  }

  const { saveAsCsv } = useJsonToCsv();
  const [showMembersModal, setShowMembersModal] = React.useState({ show: false, data: {} });
  const [showDescrptionModal, setShowDescrptionModal] = React.useState({ show: false, data: {} });
  const [entitlementList, setEntitlementList] = React.useState({ ...defaultEntitlementList });
  const [entitlementStatistics, setEntitlementStatistics] = React.useState([]);
  const [extendedAttributes, setExtendedAttributes] = React.useState({});
  const [entitlementHeaders, setEntitlementHeaders] = React.useState([]);
  const [helpData, setHelpData] = React.useState('');
  const [selectedRowKeys, setSelectedRowKeys] = React.useState([]);
  const [loadingEntitlement, setLoadingEntitlement] = React.useState(false);
  const [tableHeight, setTableHeight] = React.useState(window.screen.height - 600);
  const [tableConfig, setTableConfig] = React.useState({
    totalRecordsToFetch: tablePaginationConfig.defaultPageSize,
    start: 0
  });

  const getEntitlementList = ({ totalRecordsToFetch, start, searchVal, otherProps }) => {
    setTableConfig({ totalRecordsToFetch, start, searchVal, otherProps });
    setLoadingEntitlement(true);
    const url = 'EntitlementManagement/EntitlmentDetails';
    API.post(url, {
      PagingInfo: {
        totalRecordsToFetch: totalRecordsToFetch + '',
        start: start * totalRecordsToFetch + ''
      },
      searchVal,
      ...otherProps
    }).then(res => {
      if (res.data) {
        setEntitlementList({ ...res.data });
      }
    }).catch(err => {
      message.error("Failed to load entitlement data");
      if (localMode) {
        setEntitlementList({ ...data });
      }
    }).then(res => {
      setLoadingEntitlement(false);
    });
  }

  const getEntitlementStatistics = () => {
    const url = 'EntitlementManagement/Statistics';
    API.get(url).then(res => {
      if (Array.isArray(res.data)) {
        setEntitlementStatistics([...res.data]);
      }
    }).catch(err => {
      message.error("Failed to load statistics");
      if (localMode) {
        setEntitlementStatistics([...statisticsData]);
      }
    });
  }

  const getHelpInfoData = () => {
    const url = 'EntitlementManagement/helpurl';
    API.get(url).then(res => {
      if (res.data) {
        setHelpData(res.data);
      }
    }).catch(err => {
      message.error("Failed to load help info");
      if (localMode) {
        setHelpData(helpDataJSON);
      }
    });
  }

  const getEntitlementHeaders = () => {
    const url = 'EntitlementManagement/entitlementattributes';
    API.get(url).then(res => {
      if (Array.isArray(res.data)) {
        setEntitlementHeaders([...res.data]);
      }
    }).catch(err => {
      message.error("Failed to load headers");
      if (localMode) {
        setEntitlementHeaders([...entitlementHeadersData]);
      }
    });
  }

  const getExtendedAttributes = () => {
    const url = 'EntitlementManagement/viewableattributes';
    API.get(url).then(res => {
      if (Array.isArray(res.data)) {
        setExtendedAttributes(res.data.reduce((acc, item) => {
          acc[item.extendedAttrName] = item;
          return acc;
        }, {}));
      }
    }).catch(err => {
      // message.error("Failed to load statistics");
      if (localMode) {
        setExtendedAttributes(extendedAttributesJSON.reduce((acc, item) => {
          acc[item.extendedAttrName] = item;
          return acc;
        }, {}));
      }
    })
  }

  const prepareToExportDocument = (exportData, exportType) => {
    if (exportType === "pdf") {
      printToPDF({
        exportData: exportData,
        options: {
          hideMembersHeader: true,
          hideMembersData: true,
        },
        membersHeader: [],
        detailsHeader: entitlementHeaders
      });
    } else {
      const headerMap = entitlementHeaders.reduce((acc, item) => {
        acc[item.name] = item.displayName;
        return acc;
      }, {});
  
      const fields = exportData.Entitlement.headers?.reduce((acc, item) => {
        acc[item] = headerMap[item] || titleCase(item);
        return acc;
      }, {});
      const csv_config = {
        data: exportData.Entitlement.EntitlementDetails,
        fields: fields,
        filename: 'Entitlement_Details'
      }
      saveAsCsv(csv_config);
    }
  }

  const exportAPI = (memID, filename) => {
    setLoadingEntitlement(true);
    API.get(`EntitlementManagement/exportmember/${memID}`)
      .then((response) => {
        try {
          const exportData = { ...response.data };
          getCombinedCSVData({
            data: exportData,
            membersHeader: [],
            detailsHeader: entitlementHeaders
          });
        } catch (e) {
          message.error("Unable to export details at this moment");
        }
      })
      .catch((error) => {
        // error
        console.log(error);
        message.error("Something went wrong!");
      })
      .then(() => {
        setLoadingEntitlement(false);
        // always executed
      });
  }

  const muiltipleExportAPI = (data, type) => {
    // console.log(type);
    setLoadingEntitlement(true);
    API.post(`EntitlementManagement/export`, {
      ...data
    })
      .then((response) => {
        try {
          const exportData = { Entitlement: {...response.data} };
          prepareToExportDocument(exportData, type);
        } catch (e) {
          message.error("Unable to export details at this moment");
        }
      })
      .catch((error) => {
        // error
        console.log(error);
        message.error("Something went wrong!");
        if (localMode) {
          try {
            const exportData = { Entitlement: {...exportAllEntitlementData} };
            prepareToExportDocument(exportData, type);
          } catch (e) {
            message.error("Unable to export details at this moment");
          }
        }
      })
      .then(() => {
        setLoadingEntitlement(false);
        // always executed
      });
  }

  React.useEffect(() => {
    getEntitlementHeaders();
    getExtendedAttributes();
    getEntitlementList({
      totalRecordsToFetch: tablePaginationConfig.defaultPageSize,
      start: 0
    });
    getEntitlementStatistics();
    getHelpInfoData();
  }, []);

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      // console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
      setSelectedRowKeys(selectedRowKeys);
    },
    getCheckboxProps: (record) => ({
      disabled: true,
      // Column configuration not to be checked
      name: record.name,
    }),
    fixed: true
  };

  const handleSearchEntitlement = ({ searchVal = "", ...otherProps }) => {
    getEntitlementList({
      totalRecordsToFetch: tablePaginationConfig.defaultPageSize,
      start: 0,
      searchVal: searchVal.trim(),
      otherProps
    });
  }

  const handleAction = (actionType, actionProps) => {
    switch (actionType) {
      case 'export':
        exportAPI(actionProps.id, getExportMembersFileName(actionProps.value || actionProps.displayName));
        return;
      case 'import':
      case 'dispute':
      case 'edit_success':
        getEntitlementList(tableConfig);
        getEntitlementStatistics();
        return;
      default:
        return null;
    }
  }

  const renderCheckboxColumn = (text) => ["true", "Yes", "TRUE", "YES", "yes", "True"].includes(text) ? <CheckTrue style={{ fontSize: 16, color: '#37ae22' }} /> : <CheckFalse style={{ fontSize: 16, color: '#c1c1c1' }} />;

  const headerConfig = {
    value: {
      fixed: true
    },
    description: {
      render: (text, record) => text ?
        (<div dangerouslySetInnerHTML={{ __html: text }} className={(text || '').length > 59 ? "oe-td-description-link" : "oe-td-description"} onClick={(text || '').length > 59 ? () => setShowDescrptionModal({ show: true, data: { ...record, descrption: text } }) : () => { }} />)
        : ''
    },
    requestable: {
      align: 'center',
      render: (text) => renderCheckboxColumn(text)
    },
    users: {
      align: 'center',
      render: (text, record) => <a onClick={text > 0 ? () => setShowMembersModal({ show: true, data: { ...record } }) : () => { }} className={text > 0 ? "oe-link" : "oe-disabled-link"}>{text > 0 ? `${text}` : `0`}</a>
    },
  }

  const columns = [
    ...entitlementHeaders.map(item => ({
      sorter: ['description', 'users'].includes(item.name) ? null : (a, b) => (a[item.name] + '').localeCompare(b[item.name] + ''),
      title: item.displayName,
      dataIndex: item.name,
      render: (text, record) => extendedAttributes[item.name] && extendedAttributes[item.name]['type'] === 'boolean' ? renderCheckboxColumn(text) : record[item.name],
      className: item.className ? item.className : '',
      width: item.width ? item.width : '200px',
      align: extendedAttributes[item.name] && extendedAttributes[item.name]['type'] === 'boolean' ? 'center' : '',
      ...(headerConfig[item.name] || {}),
    })),
    entitlementHeaders.length ? {
      title: 'Action',
      dataIndex: 'action',
      width: '120px',
      align: 'center',
      fixed: 'right',
      render: (text, record) => <ResponsiveActionIcons data={record} onAction={handleAction} />
    } : {}
  ];

  const handlePageChange = (page, pageSize) => {
    getEntitlementList({ ...tableConfig, totalRecordsToFetch: pageSize, start: page - 1 });
  }

  const handleMultipleExport = (searchProps, type) => {
    muiltipleExportAPI(searchProps, type);
  }

  React.useLayoutEffect(() => {
    function updateSize() {
      setTableHeight(window.screen.height - 600);
    }
    window.addEventListener('resize', updateSize);
    updateSize();
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  return (
    <>
      <Button type="primary" onClick={() => window.open(helpData,"_blank")} className="oe-help-btn">Help</Button>
      <CardWrapper cardData={entitlementStatistics} />
      <Spin spinning={loadingEntitlement}>
        <div className="table-filter-wrapper oe-root-container">
          <SearchWithActionBar
            onSearch={handleSearchEntitlement}
            onExport={handleMultipleExport}
            onAction={handleAction}
          />
          <Table
            dataSource={entitlementList.EntitlementDetails}
            columns={columns}
            config={{
              scroll: { x: 'max-content', y: 400 },
              renderEmpty: true,
              size: 'small',
              pagination: {
                total: entitlementList.total,
                current: +tableConfig.start + 1,
                onChange: handlePageChange,
                position: ['none', 'bottomCenter'], pageSizeOptions: tablePaginationConfig.pageSizeOptions, defaultPageSize: tablePaginationConfig.defaultPageSize, showSizeChanger: true
              },
              className: "oe-table oe-entitlement-list-table",
              rowKey: 'id',
              // rowSelection: {
              //   ...rowSelection,
              // }
            }}
          />
        </div>
      </Spin>
      <Modal
        open={showMembersModal.show}
        onHide={() => setShowMembersModal({ show: false, data: {} })}
        title={`Entitlement Members`}
        subTitle={showMembersModal.data.displayName || showMembersModal.data.value}
      >
        <EntitlementDetailsWrapper
          defaultActiveKey="1"
          entitlementDetailsHeader={entitlementHeaders}
          entitlementId={showMembersModal.data.id}
          entitlementName={showMembersModal.data.value || showMembersModal.data.displayName}
          onClose={() => {
            setShowMembersModal({ show: false, data: {} });
          }}
          onEntitlementUpdate={() => getEntitlementList(tableConfig)}
        />
      </Modal>
      <Modal
        open={showDescrptionModal.show}
        className="description_modal"
        // width={"100vh"}
        height={250}
        onHide={() => setShowDescrptionModal({ show: false, data: {} })}
        title={`Entitlement Description`}
        subTitle={showDescrptionModal.data.displayName || showDescrptionModal.data.value}
      >
        <div dangerouslySetInnerHTML={{ __html: showDescrptionModal.data.descrption }} className="description_modal_text"></div>
      </Modal>
    </>
  );
}

export default OwnerEntitlement;
