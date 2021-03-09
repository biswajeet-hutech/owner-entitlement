import React from "react";

import { Spin } from "antd";

import ImportEntitlements from "./import-entitlement";
import './style.scss';

const ImportEntitlementDialog = ({
  onHide = () => {}
}) => {
  const [loading, setLoading] = React.useState(false);

  return (
    <Spin spinning={loading}>
      <ImportEntitlements onCancel={onHide}  />
    </Spin>
  );
}

export default ImportEntitlementDialog;
