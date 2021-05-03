import React from "react";
import { Row, Col } from 'antd';
import { ImportOutlined } from "@ant-design/icons";
import { strings } from '../../assets'
import Button from "../../components/button";
import Search from '../../components/search';
import Modal from '../../components/modal';
import AdvancedSearch from '../advanced-search';
import ScheduleCertification from "../scheduled-certification";
import ImportEntitlementDialog from "../import-entitlement";
import "./style.scss";

import ExportButton from "../../components/button/export-btn";

const SearchWithActionBar = ({
  onSearch = () => {},
  onExport = () => {},
  onAction = () => {},
  featureFlags={},
  helpUrl = "",
}) => {
  const [openSecduledCertModal, setOpenSecduledCertModal] = React.useState(false);
  const [openImportDialog, setOpenImportModal] = React.useState(false);
  const [searchText, setSearchTextChange] = React.useState('');
  const [searchProps, setSearchProps] = React.useState({});
  const handleSearch = (data) => {
    const payload = {};
    for (const key in data) {
      if (data[key]) {
        payload[key] = data[key];
      }
    };
    onSearch(payload);
    setSearchProps(payload);
  }

  return (
    <>
      <Row justify="space-between" className="action-wrapper">
        <Col xs={24} md={10}>
          <Row className="adv-search-wrapper">
            <Col xs={24} md={17}>
              <Search
                onSearch={(searchVal) => handleSearch({searchVal})}
                onChange={(val) => setSearchTextChange(val)}
                placeHolder={strings.entitlement_owner_search_placeholder}
              />
            </Col>
            <Col xs={24} md={6}>
              <AdvancedSearch
                onSearch={(searchProps) => handleSearch({ searchVal: searchText, ...searchProps })}
              />
            </Col>
          </Row>
        </Col>
        <Col xs={24} md={5} className="action-wrapper-btn-group">
          {
            featureFlags?.allowed === "true" && (
            <Button className="oe-importBtn oe-btn-primary" onClick={() => setOpenImportModal(true)} type="text">
              {/* <ExportsIcon /> */}
              <ImportOutlined />
              <span>Import</span>
            </Button>
            )
          }
          <ExportButton onClick={(type) => onExport(searchProps, type)} />
        </Col>
      </Row>
      <Modal
        helpUrl={helpUrl}
        open={openSecduledCertModal}
        onHide={() => setOpenSecduledCertModal(false)}
        title="Schedule Cetrification"
        config={{ className: "oe-modal oe-sceduled-cert-modal" }}
      >
        <ScheduleCertification onHide={() => setOpenSecduledCertModal(false)} />
      </Modal>
      <Modal
        open={openImportDialog}
        onHide={() => {
          setOpenImportModal(false);
        }}
        title="Import"
        subTitle="Import Entitlements from CSV file"
        config={{ className: "oe-modal oe-import-entitlement-dialog" }}
        width={800}
        height={400}
        helpUrl={helpUrl}
      >
        <ImportEntitlementDialog onHide={() => setOpenImportModal(false)} onSuccess={() => onAction('import')} />
      </Modal>
    </>
  )
}

export default SearchWithActionBar;
