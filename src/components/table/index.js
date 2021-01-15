import React from 'react';
import { Table as AntTable } from 'antd';
import "./style.scss";

const rowSelection = {
  onChange: (selectedRowKeys, selectedRows) => {
    // console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
  },
  getCheckboxProps: (record) => ({
    disabled: record.name === 'Disabled User',
    // Column configuration not to be checked
    name: record.name,
  }),
};

const Table = ({ dataSource=[], columns=[], rowKey, config }) => {
  // console.log(columns);
  return (
    <AntTable
      columns={columns}
      dataSource={dataSource}
      size="middle"
      className="oe-table"
      {...config}
    />
  );
};

export default Table;
