import React from "react";
import { message, Spin } from "antd";
import { useJsonToCsv } from 'react-json-csv';
import Table from '../../components/table';
import Modal from '../../components/modal';
import CardWrapper from './card-wrapper';
import ResponsiveActionIcons from './responsive-action-icons';
import EntitlementDetailsWrapper from "../view-edit-entitlement-wrapper";
import SearchWithActionBar from "./search-with-action-bar";
import { API, localMode } from "../../api";
import {
  CheckTrue,
  CheckFalse,
  EditModal,
  ViewModal
} from '../../assets';

import "./style.scss";
import { getExportMembersFileName } from "../../utils";
import { printToPDF } from "../../utils/exportToPdf";
import { getCombinedCSVData } from "../../utils/multiple-csv";
import HelpButton from "../../components/help-button";

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
  const [showDescrptionModal, setShowDescrptionModal] = React.useState({ show: false, data: {} });
  const [viewEditModal, setViewEditModal] = React.useState({ show: false, data: {} });
  const [entitlementList, setEntitlementList] = React.useState({ ...defaultEntitlementList });
  const [entitlementStatistics, setEntitlementStatistics] = React.useState([]);
  const [extendedAttributes, setExtendedAttributes] = React.useState({});
  const [entitlementHeaders, setEntitlementHeaders] = React.useState([]);
  const [featureFlags, setFeatureFlags] = React.useState({});
  const [helpData, setHelpData] = React.useState('');
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
        import("../../data/entitlment-dummy.json").then(res => {
          setEntitlementList(res.default);
        });
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
        import("../../data/entitlement-statistics-dummy.json").then(res => {
          setEntitlementStatistics(res.default);
        });
      }
    });
  }

  const getFeatureFlagAPI = () => {
    const url = 'EntitlementManagement/importaccess';
    API.get(url).then(res => {
      if (res.data) {
        setFeatureFlags({...res.data});
      }
    }).catch(err => {
      if (localMode) {
        import("../../data/feature-flag.json").then(res => {
          setFeatureFlags(res.default);
        });
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
        import("../../data/helpdata.json").then(res => {
          setHelpData(res.default);
        });
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
        import("../../data/entitlement-headers.json").then(res => {
          setEntitlementHeaders(res.default);
        });
      }
    });
  }

  const getExtendedAttributes = () => {
    const url = 'EntitlementManagement/viewableattributes';
    API.get(url).then(res => {
      if (Array.isArray(res.data?.ExtendedAttributes)) {
        setExtendedAttributes(res.data.ExtendedAttributes.reduce((acc, item) => {
          acc[item.name] = item;
          return acc;
        }, {}));
      }
    }).catch(err => {
      // message.error("Failed to load statistics");
      if (localMode) {
        import("../../data/advance-editable-attributes.json").then(res => {
          setExtendedAttributes(res.default.ExtendedAttributes.reduce((acc, item) => {
            acc[item.name] = item;
            return acc;
          }, {}));
        });
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
      const fields = exportData.Entitlement.headers?.reduce((acc, item) => {
        acc[item] = item;
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
      });
  }

  const muiltipleExportAPI = (data, type) => {
    setLoadingEntitlement(true);
    API.post(`EntitlementManagement/export`, {
      ...data,
      filetype: type
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
          import("../../data/export-all-entitlement.json").then(res => {
            try {
              const exportData = { Entitlement: {...res.default} };
              prepareToExportDocument(exportData, type);
            } catch (e) {
              message.error("Unable to export details at this moment");
            }
          })
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
    getFeatureFlagAPI();
    getHelpInfoData();
  }, []);

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

  const renderCheckboxColumn = (text) => ["true", "yes"].includes(text?.toLowerCase()) ? <CheckTrue style={{ fontSize: 16, color: '#37ae22' }} /> : (["false", "no"].includes(text?.toLowerCase()) ? <CheckFalse style={{ fontSize: 16, color: '#c1c1c1' }} /> : text);

  const headerConfig = {
    value: {
      fixed: true,
      render: (text) => <div className="oe-td-wrap-text" title={text}>{text}</div>
    },
    displayName: {
      render: (text) => <div className="oe-td-wrap-text" title={text}>{text}</div>
    },
    description: {
      render: (text, record) => text ?
        (<div dangerouslySetInnerHTML={{ __html: text }} className={(text || '').length > 59 ? "oe-td-description-link oe-td-wrap-text" : "oe-td-wrap-text"} onClick={(text || '').length > 59 ? () => setShowDescrptionModal({ show: true, data: { ...record, descrption: text } }) : () => { }} />)
        : ''
    },
    requestable: {
      align: 'center',
      render: (text) => renderCheckboxColumn(text)
    }
  }

  const columns = [
    ...entitlementHeaders.map(item => ({
      sorter: ['description', 'users'].includes(item.name) ? null : (a, b) => (a[item.name] + '').localeCompare(b[item.name] + ''),
      title: item.displayName,
      dataIndex: item.name,
      render: (text, record) => extendedAttributes[item.name] && extendedAttributes[item.name]['type'] === 'boolean' ? renderCheckboxColumn(text) : record[item.name],
      className: item.className ? item.className : '',
      width: item.width ? item.width : (extendedAttributes[item.name] && extendedAttributes[item.name]['type'] === 'boolean' ? '100px' : '130px'),
      align: extendedAttributes[item.name] && extendedAttributes[item.name]['type'] === 'boolean' ? 'center' : '',
      ...(headerConfig[item.name] || {}),
    })),
    entitlementHeaders.length ? {
      title: 'Action',
      dataIndex: 'action',
      width: '120px',
      align: 'center',
      fixed: 'right',
      render: (text, record) => <ResponsiveActionIcons data={record} onAction={handleAction} helpUrl={helpData} entitlementHeaders={entitlementHeaders} />
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
      <HelpButton helpUrl={helpData} className="oe-help-btn" />
      <CardWrapper cardData={entitlementStatistics} />
      <Spin spinning={loadingEntitlement}>
        <div className="table-filter-wrapper oe-root-container">
          <SearchWithActionBar
            onSearch={handleSearchEntitlement}
            onExport={handleMultipleExport}
            onAction={handleAction}
            featureFlags={featureFlags}
            helpUrl={helpData}
          />
          <Table
            dataSource={entitlementList.EntitlementDetails}
            columns={columns}
            config={{
              scroll: { x: 'max-content', y: '35vh' },
              renderEmpty: true,
              size: 'small',
              pagination: {
                total: entitlementList.total,
                current: +tableConfig.start + 1,
                onChange: handlePageChange,
                position: ['none', 'bottomCenter'], pageSizeOptions: tablePaginationConfig.pageSizeOptions, defaultPageSize: tablePaginationConfig.defaultPageSize, showSizeChanger: true
              },
              className: "oe-table oe-entitlement-list-table",
              rowKey: 'id'
            }}
          />
        </div>
      </Spin>
      <Modal
        open={showDescrptionModal.show}
        className="description_modal"
        // width={"100vh"}
        height={250}
        onHide={() => setShowDescrptionModal({ show: false, data: {} })}
        title={`Entitlement Description`}
        subTitle={showDescrptionModal.data.displayName || showDescrptionModal.data.value}
        helpUrl={helpData}
      >
        <div dangerouslySetInnerHTML={{ __html: showDescrptionModal.data.descrption }} className="description_modal_text"></div>
      </Modal>
      <Modal
        open={viewEditModal.show}
        onHide={() => setViewEditModal({ show: false, edit: false })}
        footer={viewEditModal.edit ? undefined : null}
        titleIcon={viewEditModal.edit ? (<EditModal />) : (<ViewModal />)}
        helpUrl={helpData}
        title={<span>{`${viewEditModal.edit ? 'Edit' : 'View'} Details`}</span>} subTitle={viewEditModal.data?.displayName || viewEditModal.data?.value}>
        <EntitlementDetailsWrapper
          defaultActiveKey="2"
          entitlementId={viewEditModal.data?.id}
          editMode={viewEditModal.edit}
          onClose={() => { setViewEditModal({ show: false, edit: false }) }}
          onSuccess={() => { setViewEditModal({ show: false, edit: false, action: 'edit_success' }); handleAction('edit_success')}}
        />
      </Modal>
    </>
  );
}

export default OwnerEntitlement;
