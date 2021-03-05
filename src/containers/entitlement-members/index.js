import React from "react";
import { Col, Row, Popover, message, Spin } from "antd";
import { useJsonToCsv } from 'react-json-csv';

import Button from "../../components/button";
import Table from '../../components/table';
import Typography from "../../components/typography";
import Search from "../../components/search";
import entitlementJSON from "../../data/entitlement-members-attribute.json";
import exportJSON from "../../data/export-entitlement.json";
import { API, localMode } from "../../api";
import './style.scss';
import { ExportsIcon,ExportHoverIcon,InfoIcon,ApprovedIcon,RevokedIcon, NotCertifiedIcon,OpenIcon,PendingIcon, InfoHoverIcon,strings } from './../../assets';
import { getExportMembersFileName } from "../../utils";
import ExportButton from "../../components/button/export-btn";

const UserStatus = ({status}) =>{
 let isActive = status.toLowerCase()==='active'
 return <div className={`userStatus_${isActive?'active':'disable'}`}><div>{`${status}`}</div></div>
}

const CertificationStatus = ({status}) =>{
  switch(status.toLowerCase()) {
    case 'approved': return(<div className={`certificationStatus ${status.toLowerCase()}`}><ApprovedIcon alt={status}/> <span>{status}</span></div>)
    case 'revoked': return(<div className={`certificationStatus ${status.toLowerCase()}`}><RevokedIcon alt={status}/> <span>{status}</span></div>)
    case 'open': return(<div className={`certificationStatus ${status.toLowerCase()}`}><OpenIcon alt={status}/> <span>{status}</span></div>)
    case 'pending': return(<div className={`certificationStatus ${status.toLowerCase()}`}><PendingIcon alt={status}/> <span>{status}</span></div>)
    case 'not certified': return(<div className={`certificationStatus ${status.toLowerCase()}`}><NotCertifiedIcon alt={status}/> <span>{status}</span></div>)
    default: return(<div className={`certificationStatus revoked`}><RevokedIcon alt={status}/> <span>{status}</span></div>)
  }
}

const headerConfig = {
  name: {
    title: 'Name',
    dataIndex: 'name',
    render: (text, record) => record.name? <span>{record.name}</span> : ''
  },
  status: {
    title: 'User Status',
    dataIndex: 'status',
    render: (text, record) => <UserStatus status={record.status}/>
  },
  certificationaction: {
    title: 'Certification Action',
    dataIndex: 'certificationaction',
    width: "180px",
    render: (text, record) => <CertificationStatus status={record.certificationaction}/>
  },
};

const EntitlementMembers = ({
  data={},
  id,
  entitlementName = "",
  onUpdate
}) => {
  const { saveAsCsv } = useJsonToCsv();
  const [entitlementHeaders, setEntitlementHeaders] = React.useState([]);
  const [loadingEntitlement, setLoadingEntitlement] = React.useState(false);
  const [paginationConfig, setPaginationConfig] = React.useState({
    totalRecordsToFetch: 25,
    start: 1
  });
  const handleUpdateSearchResult = ({ page, pageSize, attrVal }) => {
    setPaginationConfig({
      totalRecordsToFetch: pageSize || 25,
      start: page || 1
    });

    const totalRecordsToFetch = pageSize || 25;
    const start = page ? page - 1 : 0;

    onUpdate({
      totalRecordsToFetch: totalRecordsToFetch+'',
      start: start*totalRecordsToFetch+'',
      attrVal: attrVal || ''
    });
  }


  const getEntitlementHeaders = () => {
    const url = 'EntitlementManagement/memberattributes';
    API.get(url).then(res => {
      if (Array.isArray(res.data)) {
        setEntitlementHeaders([...res.data]);
      }
    }).catch(err => {
      message.error("Failed to load headers");
      if (localMode) {
        setEntitlementHeaders([...entitlementJSON]);
      }
    });
  }

  const exportAPI = (entitlementID, type) => {
    setLoadingEntitlement(true);
    API.get(`EntitlementManagement/exportmember/${entitlementID}`)
    .then((response) => {
      try {
        const exportData = { ...response.data.Entitlement };
        const fields = exportData.headers?.reduce((acc, item) => {
          acc[item] = item;
          return acc;
        }, {});
        const csv_config = {
          data: [exportData.EntitlementDetails],
          fields: fields,
          filename: getExportMembersFileName(entitlementName)
        }
        saveAsCsv(csv_config);
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
          const exportData = { ...exportJSON.Entitlement };
          const fields = exportData.headers?.reduce((acc, item) => {
            acc[item] = item;
            return acc;
          }, {});
          const csv_config = {
            data: [exportData.EntitlementDetails],
            fields: fields,
            filename: getExportMembersFileName(entitlementName)
          }
          saveAsCsv(csv_config);
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
    ...entitlementHeaders.map(item => ({
      title: item.displayName,
      dataIndex: item.name,
      render: (text,record)=> record[item.name] || '',
      className:item.className || '',
      ...(headerConfig[item.name] || {})
    }))
  ];

  React.useEffect(() => {
    getEntitlementHeaders();
  }, []);

  return (
    <Spin spinning={loadingEntitlement}>
      <div className="oe-sc-wrapper">
        {/* <Row justify="space-between" className="oe-sc-search-label">
          <Typography type="title2">
            <span>Search</span>
            <Popover
              content={<div style={{ maxWidth: 200, fontSize: 13 }}>Search First Name, Last Name, Email Address , Status and Manager</div>}
              trigger="hover"
              placement="bottom"
              onClick={(e) => e.stopPropagation()}
            >
              <span style={{ margin: '0 5px' }}><InfoIcon width={14} height={14} /></span>
            </Popover>
          </Typography>
        </Row> */}
        <Row justify="space-between" className="oe-sc-row-padding">
          <Col md={10}>
            <Search placeHolder={strings.entitlement_members_search_placeholder} onSearch={(v) => handleUpdateSearchResult({ attrVal: v })} />
          </Col>
          <Col>
            <ExportButton onClick={(type) => exportAPI(id, type)} tooltip="Export members" />
          </Col>
        </Row>
        <Row className="oe-sc-row-padding">
          <Table
            dataSource={data.MemberDetails || []}
            columns={columns}
            config={{
              scroll:{ y: 320, x: 1500 },
              size: 'small',
              pagination: {
                total: data.total,
                current: paginationConfig.start,
                onChange: (p, ps) => handleUpdateSearchResult({page: p, pageSize: ps}),
                position: ['none', 'bottomCenter'], pageSizeOptions: [25, 50, 100], defaultPageSize: 25, showSizeChanger: true },
              className: "oe-table oe-scheduled-cert-table",
              rowKey: 'id'
            }}
          />
        </Row>
      </div>
    </Spin>
  );
}

export default EntitlementMembers;
