import React from "react";
import { CheckCircleFilled, StopOutlined } from '@ant-design/icons';
import Button from "../../components/button";
import Table from '../../components/table';
import './style.scss';
import { Row } from "antd";
import Typography from "../../components/typography";

const columns = [
  {
    title: 'Application',
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
  },
  {
    title: 'Requestable',
    dataIndex: 'requestable',
    align: 'center',
    render: (text) => text === "true" ? <CheckCircleFilled style={{ fontSize: 16, color: '#37ae22' }} /> : <StopOutlined style={{ fontSize: 16, color: '#c1c1c1' }} />
  },
  {
    title: 'Members',
    dataIndex: 'users',
    render: (text) => <a>{`${text} Member${text > 1 ? 's' : ''}`}</a>
  },
];

const tableData = [
  {
    "owner": "Entitlement Owner Workgroup",
    "intAttr": "10777",
    "displayName": "Display_ent_0000001000",
    "description": "Display_ent_0000001000ent_0000001000",
    "application": "Entitlement Data Application",
    "soxlevel": "SoX Level3",
    "ruleattr": null,
    "level1approver": "5132",
    "boolattr": "true",
    "type": "Entitlement",
    "risklevel": "Risk Level1",
    "level2approver": "502",
    "lastrefresh": "",
    "users": "1",
    "CERTIFIABLE": null,
    "modified": "",
    "id": "8a405b8a75ae475f0175ae6677b04113",
    "attribute": "entitlement",
    "requestable": "true",
    "value": "ent_0000001000",
    "dateattr": null
  },
  {
    "owner": "The Administrator",
    "intAttr": "1001",
    "displayName": "Test Access to Entitlement Application for admins",
    "description": "Test Access to Entitlment Application",
    "application": "Entitlement Data Application",
    "soxlevel": "SoX Level1",
    "ruleattr": "All Objects",
    "level1approver": null,
    "boolattr": "true",
    "type": "Entitlement",
    "risklevel": "Risk Level1",
    "level2approver": null,
    "lastrefresh": "",
    "users": "1",
    "CERTIFIABLE": "Yes",
    "modified": "",
    "id": "8a405b8a75ae475f0175ae5b218f12e9",
    "attribute": "entitlement",
    "requestable": "false",
    "value": "ent_0000004079",
    "dateattr": "12-25-2020"
  },
  {
    "owner": "The Administrator",
    "intAttr": null,
    "displayName": "Display_ent_0000001001",
    "description": "Display_ent_0000001001",
    "application": "Entitlement Data Application",
    "soxlevel": "SoX Level3",
    "ruleattr": null,
    "level1approver": "Test Work Group1",
    "boolattr": "false",
    "type": "Entitlement",
    "risklevel": "Risk Level1",
    "level2approver": "Test Work Group1",
    "lastrefresh": "",
    "users": "1",
    "CERTIFIABLE": "Yes",
    "modified": "",
    "id": "8a405b8a75ae475f0175ae6677c24114",
    "attribute": "entitlement",
    "requestable": "true",
    "value": "ent_0000001001",
    "dateattr": null
  },
  {
    "owner": "The Administrator",
    "intAttr": null,
    "displayName": "Display_ent_0000001002",
    "description": "Display_ent_0000001002",
    "application": "Entitlement Data Application",
    "soxlevel": "SoX Level3",
    "ruleattr": null,
    "level1approver": null,
    "boolattr": "true",
    "type": "Entitlement",
    "risklevel": "Risk Level1",
    "level2approver": "FloJohnston",
    "lastrefresh": "",
    "users": "1",
    "CERTIFIABLE": "No",
    "modified": "",
    "id": "8a405b8a75ae475f0175ae6677cc4115",
    "attribute": "entitlement",
    "requestable": "true",
    "value": "ent_0000001002",
    "dateattr": null
  },
]

const ScheduleCertification = ({
  entitlementData,
  onHide
}) => {

  return (
    <>
      <Row className="oe-sc-row-padding">
        <Typography type="body1">You may modify the attributes before submiting for certification</Typography>
      </Row>
      <Row className="oe-sc-row-padding">
        <Table
          dataSource={tableData}
          columns={columns}
          config={{
            scroll:{ y: 240, x: "max-content" },
            tableLayout:"auto",
            pagination: false,
            className: "oe-table oe-scheduled-cert-table",
            rowKey: 'id',
            tableLayout: "fixed",
            scroll: { x: 1500 }
          }}
        />
      </Row>
      <Row justify="end" className="oe-sc-row-padding">
        <Button type="secondary" size="large" onClick={onHide}>Cancel</Button>
        <Button type="primary" size="large">Submit</Button>
      </Row>
    </>
  );
}

export default ScheduleCertification;
