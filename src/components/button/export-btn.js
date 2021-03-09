import React from "react";
import { Menu, Dropdown, Tooltip } from 'antd';
import { FilePdfOutlined, FileTextOutlined } from '@ant-design/icons';
import { ExportsIcon } from "../../assets";
import "./style.scss";


function ExportButton({
  onClick,
  tooltip="Export Entitlements"
}) {
  function handleMenuClick(e) {
    onClick(e.key);
  }

  const menu = (
    <Menu onClick={handleMenuClick}>
      <Menu.Item key="csv" icon={<FileTextOutlined />}>
        Export as CSV
      </Menu.Item>
      <Menu.Item key="pdf" icon={<FilePdfOutlined />}>
        Export as PDF
      </Menu.Item>
    </Menu>
  );

  return (
    <Tooltip title={tooltip}>
      <Dropdown.Button onClick={() => onClick('csv')} overlay={menu} placement="bottomCenter" className="oe-exportBtn">
        <ExportsIcon width={24} height={24} />
      </Dropdown.Button>
    </Tooltip>
  )
}

export default ExportButton;