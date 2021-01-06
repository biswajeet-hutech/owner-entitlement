import React from "react";
import { Popover, Row, Col } from 'antd';
import { SettingOutlined } from '@ant-design/icons';
import Button from '../button';
import "./style.scss";
import Typography from "../typography";
import Dropdown from "../dropdown";

const dropdownOptions = [
  {
    label: 'Application 1',
    value: 'app1'
  },
  {
    label: 'Application 2',
    value: 'app2'
  },
  {
    label: 'Application 3',
    value: 'app3'
  },
  {
    label: 'Application 4',
    value: 'app4'
  }
]

const AdvancedSearchContent = ({ onClose }) => (
  <div className="oe-adv-search-content">
    <Typography type="title2" className="oe-overlay-header">Select Search Attribute Fileds</Typography>
    <Row>
      <Col md={12}>
        <Dropdown options={dropdownOptions} onChange={(v, e) => console.log(v, e)} label="Application" />
      </Col>
      <Col md={12}>
        <Dropdown options={dropdownOptions} onChange={(v, e) => console.log(v, e)} label="Attribute" />
      </Col>
    </Row>
    <div className="divider"></div>
    <Row>
      <Col md={12}>
        <Dropdown options={dropdownOptions} onChange={(v, e) => console.log(v, e)} label="Application" />
      </Col>
      <Col md={12}>
        <Dropdown options={dropdownOptions} onChange={(v, e) => console.log(v, e)} label="Attribute" />
      </Col>
    </Row>
    <div className="divider"></div>
    <Row>
      <Col md={12}>
        <Dropdown options={dropdownOptions} onChange={(v, e) => console.log(v, e)} label="Application" />
      </Col>
      <Col md={12}>
        <Dropdown options={dropdownOptions} onChange={(v, e) => console.log(v, e)} label="Attribute" />
      </Col>
    </Row>
    <Row justify="end" className="oe-overlay-footer">
      <Button onClick={onClose}>Cancel</Button>
      <Button type="primary">Apply</Button>
    </Row>
  </div>
)

class AdvancedSearch extends React.Component {
  state = {
    visible: false,
  };

  hide = () => {
    this.setState({
      visible: false,
    });
  };

  handleVisibleChange = visible => {
    this.setState({ visible });
  };

  render() {
    return (
      <div className="oe-adv-search">
        <Popover
          content={<AdvancedSearchContent onClose={this.hide} />}
          title=""
          trigger="click"
          visible={this.state.visible}
          onVisibleChange={this.handleVisibleChange}
          className="oe-popover"
          placement="bottomRight"
          autoAdjustOverflow={true}
          arrowPointAtCenter={true}
          overlayClassName="oe-overlay"
          overlayStyle={{ left: '40px' }}
          arrowContent={null}
        >
          <Button type="hybrid" leftIcon={<SettingOutlined />} className="adv-btn-wrapper">Advanced Search</Button>
        </Popover>
      </div>
    );
  }
}

export default AdvancedSearch;
