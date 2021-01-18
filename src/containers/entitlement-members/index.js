import React from "react";
import { Col, Row, Popover, message, Spin } from "antd";
import { useJsonToCsv } from 'react-json-csv';

import Button from "../../components/button";
import Table from '../../components/table';
import Typography from "../../components/typography";
import Search from "../../components/search";

import { API, localMode } from "../../api";
import './style.scss';
import { ExportsIcon,ExportHoverIcon,InfoIcon,ApprovedIcon,RevokedIcon,OpenIcon,PendingIcon, InfoHoverIcon,strings } from './../../assets';

const UserStatus = ({status}) =>{
 let isActive = status.toLowerCase()==='active'
 return <div className={`userStatus_${isActive?'active':'disable'}`}><div>{`${status}`}</div></div>
}

const CertificationStatus = ({status}) =>{
  switch(status.toLowerCase()){
    case 'approved':return(<div className={`certificationStatus ${status.toLowerCase()}`}><ApprovedIcon alt={status}/> <span>{status}</span></div>)
    case 'revoked':return(<div className={`certificationStatus ${status.toLowerCase()}`}><RevokedIcon alt={status}/> <span>{status}</span></div>)
    case 'open':return(<div className={`certificationStatus ${status.toLowerCase()}`}><OpenIcon alt={status}/> <span>{status}</span></div>)
    case 'pending':return(<div className={`certificationStatus ${status.toLowerCase()}`}><PendingIcon alt={status}/> <span>{status}</span></div>)
    default:return(<div className={`certificationStatus revoked`}><RevokedIcon alt={status}/> <span>Revoked</span></div>)
  }
}
const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    width:"100px",
    render: (text, record) => <span>{record.name}</span>
  },
  {
    title: 'Email',
    width:"180px",
    dataIndex: 'email',
  },
  {
    title: 'User Status',
    dataIndex: 'status',
    width:"100px",
    render: (text, record) => <UserStatus status={record.status}/>
  },
  {
    title: 'Manager',
    width:"130px",
    dataIndex: 'manager',
  },
  {
    title: 'Source',
    width:"100px",
    dataIndex: 'source',
  },
  {
    title: 'Certification Action',
    width:"110px",
    dataIndex: 'certificationaction',
    render: (text, record) => <CertificationStatus status={record.certificationaction}/>
  },
  {
    title: 'Certification Action Date',
    width:"90px",
    dataIndex: 'certificationactiondate',
  }
];

const EntitlementMembers = ({
  data={},
  id,
  onUpdate
}) => {
  const { saveAsCsv } = useJsonToCsv();
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

  const exportAPI = (entitlementID) => {
    setLoadingEntitlement(true);
    API.get(`EntitlementManagement/exportmember/${entitlementID}`)
    .then((response) => {
      try {
        const exportData = {...response.data};
        const fields = exportData.headers?.reduce((acc, item) => {
          acc[item] = item;
          return acc;
        }, {});
        const csv_config = {
          data: exportData.details,
          fields: fields,
          filename: 'Entitlement_Members'
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
    })
    .then(() => {
      setLoadingEntitlement(false);
      // always executed
    });
  }

  return (
    <Spin spinning={loadingEntitlement}>
      <div className="oe-sc-wrapper">
        <Row justify="space-between" className="oe-sc-search-label">
          <Typography type="title2">
            <span>Search by name or email</span>
            <Popover
              content={<div style={{ maxWidth: 200, fontSize: 13 }}>Search First Name, Last Name, Email Address , Status and Manager</div>}
              trigger="hover"
              placement="bottom"
              onClick={(e) => e.stopPropagation()}
            >
              <span style={{ margin: '0 5px' }}><InfoIcon width={14} height={14} /></span>
            </Popover>
          </Typography>
        </Row>
        <Row justify="space-between" className="oe-sc-row-padding">
          <Col md={8}>
            <Search placeHolder={strings.entitlement_members_search_placeholder} onSearch={(v) => handleUpdateSearchResult({ attrVal: v })} />
          </Col>
          <Col>
            <Button
              type="secondary"
              leftIcon={<>
                <ExportsIcon className="normal"/>
                <ExportHoverIcon className="hover" width="16px" height="16px"/></>
              }
              rightIcon={(
                <Popover
                  content={<div style={{ maxWidth: 200, fontSize: 13 }}>Export entitlement members details</div>}
                  trigger="hover"
                  placement="bottomRight"
                >
                  <span style={{ padding: 0 }}>
                    <InfoIcon width={14} height={14} className="normal" />
                    <InfoHoverIcon width={14} height={14} className="hover"/>
                  </span>
                </Popover>
              )}
              className="oe-exportBtn"
              onClick={() => exportAPI(id)}
            >
              Export
            </Button>
          </Col>
        </Row>
        <Row className="oe-sc-row-padding">
          <Table
            dataSource={data.MemberDetails || []}
            columns={columns}
            config={{
              scroll:{ y: 360, x: "max-content" },
              tableLayout:"auto",
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
