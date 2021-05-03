import React from "react";

import './style.scss';
import FormElement from "../../components/form-element";
import Table from "../../components/table";

const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
  },
  {
    title: 'Owner',
    dataIndex: 'owner',
  },
];

const tableData = [
  {
    "owner": "Bob.Employee",
    "name": "CN=Denied RODC Password Replication Group,CN=Users,DC=st,DC=com"
  },
  {
    "owner": "Biswa.Employee",
    "name": "CN=Denied RODC Password Replication Group,CN=Users,DC=st,DC=com"
  },
]

const formConfig = [
  {
    key: 'searchMembers',
    label: 'Search Members',
    value: <Table dataSource={tableData} columns={columns} config={{ pagination: false, size: 'small' }} />,
    type: '',
    fullWidth: true,
    readOnly: true
  },
]

const MembersPanel = ({
  tabs = [],
  filled
}) => {

  return (
    <>
    <div className="form-section form-section-readonly">
    {
      formConfig.map(formElement => <FormElement {...formElement} />)
    } 
    </div>
    </>
  );
}

export default MembersPanel;
