import React from "react";
import {ExportsIcon,InfoIcon,ApprovedIcon,RevokedIcon,OpenIcon,PendingIcon} from './../../assets'
import Button from "../../components/button";
import Table from '../../components/table';
import './style.scss';
import { Col, Row } from "antd";
import Typography from "../../components/typography";
import Search from "../../components/search";

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
    default:return(<div className={`certificationStatus pending`}><PendingIcon alt={status}/> <span>Pending</span></div>)
  }
}
const columns = [
  {
    title: 'Name',
    dataIndex: 'firstName',
    width:"100px",
    render: (text, record) => <span>{`${record.firstname || '--'} ${record.lastname || '--'}`}</span>
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
    width:"100px",
    dataIndex: 'certificationaction',
    render: (text, record) => <CertificationStatus status={record.certificationaction}/>
  },
  {
    title: 'Certification Action Date',
    width:"90px",
    dataIndex: 'certificationactiondate',
  },
];

const EntitlementMembers = ({
  data={},
  onUpdate
}) => {
  const handleUpdateSearchResult = ({ page, pageSize, attrVal }) => {
    // console.log(page, pageSize);
    const totalRecordsToFetch = pageSize || 25;
    const start = page ? page - 1 : 0;
    onUpdate({
      totalRecordsToFetch: totalRecordsToFetch+'',
      start: start*totalRecordsToFetch+'',
      attrVal: attrVal || ''
    });
  }
  return (
    <div className="oe-sc-wrapper">
      <Row justify="space-between" className="oe-sc-search-label">
        <Typography type="title2">Search by name or email</Typography>
      </Row>
      <Row justify="space-between" className="oe-sc-row-padding">
        <Col md={8}>
          <Search placeHolder="Search by name, email or status" onSearch={(v) => handleUpdateSearchResult({ attrVal: v })} />
        </Col>
        <Col>
          <Button type="secondary" leftIcon={<ExportsIcon />} rightIcon={<InfoIcon/>} className="exportBtn">Export</Button>
        </Col>
      </Row>
      <Row className="oe-sc-row-padding">
        <Table
          dataSource={data.MemberDetails || []}
          columns={columns}
          config={{
            scroll:{ y: 360, x: "1200" },
            tableLayout:"auto",
            pagination: {
              total: data.total,
              onChange: (p, ps) => handleUpdateSearchResult({page: p, pageSize: ps}),
              position: ['none', 'bottomCenter'], pageSizeOptions: [25, 50, 100], defaultPageSize: 25, showSizeChanger: true },
            className: "oe-table oe-scheduled-cert-table",
            rowKey: 'id'
          }}
        />
      </Row>
    </div>
  );
}

export default EntitlementMembers;
