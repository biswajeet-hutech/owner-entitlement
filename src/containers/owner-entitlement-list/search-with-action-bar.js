import React from "react";
import { Row, Col } from 'antd';
import { ExportsIcon, ExportHoverIcon } from './../../assets'
import Button from "../../components/button";
import Search from '../../components/search';
import Modal from '../../components/modal';
import InfoContent from './info-content';
import AdvancedSearch from '../advanced-search';
import ScheduleCertification from "../scheduled-certification";
import "./style.scss";

const SearchWithActionBar = ({
  onSearch = () => {},
  onExport = () => {},
  onSearchTextChange = () => {}
}) => {
  const [openSecduledCertModal, setOpenSecduledCertModal] = React.useState(false);
  const [searchText, setSearchTextChange] = React.useState('');
  const [searchProps, setSearchProps] = React.useState({});
  const [popVisible, setPopVisible] = React.useState({
    import: false,
    export: false,
    scheduledCert: false
  });

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
        <Col xs={24} md={12}>
          <Row className="adv-search-wrapper">
            <Col xs={24} md={17}>
              <Search
                onSearch={(searchVal) => handleSearch({searchVal})}
                onChange={(val) => setSearchTextChange(val)}
                placeHolder="Search by Application, Display Name or Entitlement value"
              />
            </Col>
            <Col xs={24} md={6}>
              <AdvancedSearch
                onSearch={(searchProps) => handleSearch({ searchVal: searchText, ...searchProps })}
              />
            </Col>
          </Row>
        </Col>
        <Col xs={24} md={12} className="action-wrapper-btn-group">
          <Button className="oe-exportBtn" onClick={() => onExport(searchProps)} type="text" leftIcon={
          <><ExportsIcon className="normal"/><ExportHoverIcon className="hover" width="16px" height="16px"/></>} rightIcon={(
            <InfoContent
              type="export"
              visible={popVisible.export}
              onVisibleChange={(v) => setPopVisible({ ...popVisible, export: v })}
              onHide={() => setPopVisible({ ...popVisible, export: false })} />
          )}>Export</Button>
        </Col>
      </Row>
      <Modal open={openSecduledCertModal} onHide={() => setOpenSecduledCertModal(false)} title="Schedule Cetrification" config={{ className: "oe-modal oe-sceduled-cert-modal" }}>
        <ScheduleCertification onHide={() => setOpenSecduledCertModal(false)} />
      </Modal>
    </>
  )
}

export default SearchWithActionBar;
