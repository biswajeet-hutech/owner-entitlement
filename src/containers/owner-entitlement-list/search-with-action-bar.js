import React from "react";
import { Row, Col } from 'antd';
import { ImportOutlined, ExportOutlined, FileDoneOutlined } from '@ant-design/icons';
import Button from "../../components/button";
import Search from '../../components/search';
import Modal from '../../components/modal';
import InfoContent from './info-content';
import AdvancedSearch from '../../components/advanced-search';
import "./style.scss";
import ScheduleCertification from "../scheduled-certification";

const SearchWithActionBar = ({
  onSearch
}) => {
  const [openSecduledCertModal, setOpenSecduledCertModal] = React.useState(false);
  const [popVisible, setPopVisible] = React.useState({
    import: false,
    export: false,
    scheduledCert: false
  });

  return (
    <>
      <Row justify="space-between" className="action-wrapper">
        <Col xs={24} md={12}>
          <Row className="adv-search-wrapper">
            <Col xs={24} md={17}>
              <Search onSearch={onSearch} />
            </Col>
            <Col xs={24} md={6}>
              <AdvancedSearch />
            </Col>
          </Row>
        </Col>
        <Col xs={24} md={12} className="action-wrapper-btn-group">
          <Button type="primary" leftIcon={<ImportOutlined />} rightIcon={(
            <InfoContent
              type="import"
              visible={popVisible.import}
              onVisibleChange={(v) => setPopVisible({ ...popVisible, import: v })}
              onHide={() => setPopVisible({ ...popVisible, import: false })} />
          )}>Import</Button>
          <Button type="secondary" leftIcon={<ExportOutlined />} rightIcon={(
            <InfoContent
              type="export"
              visible={popVisible.export}
              onVisibleChange={(v) => setPopVisible({ ...popVisible, export: v })}
              onHide={() => setPopVisible({ ...popVisible, export: false })} />
          )}>Export</Button>
          <Button type="secondary" leftIcon={<FileDoneOutlined />} rightIcon={(
            <InfoContent
              type="scheduledCert"
              visible={popVisible.scheduledCert}
              onVisibleChange={(v) => setPopVisible({ ...popVisible, scheduledCert: v })}
              onHide={() => setPopVisible({ ...popVisible, scheduledCert: false })} />
          )}
          onClick={() => setOpenSecduledCertModal(true)}>Schedule Certification</Button>
        </Col>
      </Row>
      <Modal open={openSecduledCertModal} onHide={() => setOpenSecduledCertModal(false)} title="Schedule Cetrification" config={{ className: "oe-modal oe-sceduled-cert-modal" }}>
        <ScheduleCertification onHide={() => setOpenSecduledCertModal(false)} />
      </Modal>
    </>
  )
}

export default SearchWithActionBar;
