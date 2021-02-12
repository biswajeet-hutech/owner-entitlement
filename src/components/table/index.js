import React from 'react';
import { Table as AntTable } from 'antd';
import "./style.scss";

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
