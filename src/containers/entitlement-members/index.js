import React from "react";
import { ExportOutlined } from '@ant-design/icons';
import Button from "../../components/button";
import Table from '../../components/table';
import './style.scss';
import { Col, Row } from "antd";
import Typography from "../../components/typography";
import Search from "../../components/search";

const columns = [
  {
    title: 'Name',
    dataIndex: 'firstName',
    render: (text, record) => <span>{`${record.firstname || '--'} ${record.lastname || '--'}`}</span>
  },
  {
    title: 'Email',
    dataIndex: 'email',
  },
  {
    title: 'User Status',
    dataIndex: 'status',
  },
  {
    title: 'Manager',
    dataIndex: 'manager',
  },
  {
    title: 'Source',
    dataIndex: 'source',
  },
  {
    title: 'Certification Action',
    dataIndex: 'certificationaction',
  },
  {
    title: 'Certification Action Date',
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
          <Button type="secondary" leftIcon={<ExportOutlined />} disabled>Export</Button>
        </Col>
      </Row>
      <Row className="oe-sc-row-padding">
        <Table
          dataSource={data.MemberDetails || []}
          columns={columns}
          config={{
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
