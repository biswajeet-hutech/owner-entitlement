import React from "react";
import { Row, Col, Tooltip } from 'antd';
import { ImportOutlined } from "@ant-design/icons";
import { strings } from './../../assets'
import Button from "../../components/button";
import Search from '../../components/search';
import Modal from '../../components/modal';
import AdvancedSearch from '../advanced-search';
import ScheduleCertification from "../scheduled-certification";
import ImportEntitlementDialog from "../import-entitlement";
import "./style.scss";

import ExportButton from "../../components/button/export-btn";

const SelfReviewContainer = ({ total, reviewed }) => (
  <div className="oe-sr-container">
    <div className="oe-sr-title">Review Status:</div>
    <Tooltip title={`Total Reviewed: ${reviewed} out of ${total}`}>
      <div className="oe-sr-progress">
        <div className="oe-sr-progress-bar" style={{ width: `${(+reviewed/+total) * 100}%` }}></div>
      </div>
    </Tooltip>
  </div>
)

const SearchWithActionBar = ({
  reviewStats=[],
  onSearch = () => {},
  onExport = () => {},
  onAction = () => {},
  featureFlags={}
}) => {
  const [openSecduledCertModal, setOpenSecduledCertModal] = React.useState(false);
  const [openImportDialog, setOpenImportModal] = React.useState(false);
  const [searchText, setSearchTextChange] = React.useState('');
  const [searchProps, setSearchProps] = React.useState({});
  const reviewStatConfig = reviewStats.reduce((acc, item) => {
    acc[item.statName] = item;
    return acc;
  }, {});
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
        <Col xs={24} md={9}>
          <SelfReviewContainer total={reviewStatConfig.total?.statVal} reviewed={reviewStatConfig.TotalReviewedEntitlements?.statVal} />
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
      <Modal open={openSecduledCertModal} onHide={() => setOpenSecduledCertModal(false)} title="Schedule Cetrification" config={{ className: "oe-modal oe-sceduled-cert-modal" }}>
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
      >
        <ImportEntitlementDialog onHide={() => setOpenImportModal(false)} onSuccess={() => onAction('import')} />
      </Modal>
    </>
  )
}

export default SearchWithActionBar;
