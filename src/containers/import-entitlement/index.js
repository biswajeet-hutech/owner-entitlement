import React from "react";

import { Spin } from "antd";

import ImportEntitlements from "./import-entitlement";
import './style.scss';

const ImportEntitlementDialog = ({
  onHide = () => {},
  onSuccess = () => {}
}) => {
  const [loading, setLoading] = React.useState(false);

  return (
    <Spin spinning={loading}>
      <ImportEntitlements onCancel={onHide} onSuccess={onSuccess}  />
    </Spin>
  );
}

export default ImportEntitlementDialog;
