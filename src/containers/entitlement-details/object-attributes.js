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

const ObjectAttributes = ({
  data
}) => {

  const formConfig = [
    {
      key: 'groupHierarchy',
      label: 'Group Hierarchy',
      value: <Table dataSource={data.ObjecttInheritance} columns={columns} config={{ pagination: false, size: 'small' }} />,
      type: '',
      readOnly: true
    },
  ]

  const constructData = (data) => {
    const result = [];
    const target = data.ObjectProperties;
    for (const key in target) {
      if (target.hasOwnProperty(key)) {
        const element = target[key];
        if (Array.isArray(element)) {
          result.push({
            key,
            label: key,
            value: element.join(', '),
            type: 'input',
            readOnly: true
          })
        } else {
          result.push({
            key,
            label: key,
            value: element || "----",
            type: 'input',
            readOnly: true
          })
        }
      }
    }

    return result;
  }
  return (
    <>
    <div className="form-section form-section-readonly">
    {
      constructData(data || {}).map(formElement => <FormElement {...formElement} />)
    } 
    {
      formConfig.map(formElement => <FormElement {...formElement} />)
    } 
    </div>
    </>
  );
}

export default ObjectAttributes;
