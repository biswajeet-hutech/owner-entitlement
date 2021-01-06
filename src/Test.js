
import { PoweroffOutlined } from '@ant-design/icons';
import logo from './logo.svg';
import './App.scss';
import Button from './components/button';
import Tabs from './components/tab';
import Typography from './components/typography';
import Table from './components/table';

import 'antd/dist/antd.css';

function Test() {
  return (
    <div className="App">
      <Button type="primary" icon={<PoweroffOutlined />}>Import</Button>
      <Button type="secondary" icon={<PoweroffOutlined />}>Export</Button>
      <Tabs tabs={[{
        name: 'Owner Entitlement',
        content: <h1>Hello</h1>
      },
      {
        name: 'Other Tab',
        content: 'Hello 2'
      }]}
      filled />
      <Typography type="heading1" gutterBottom>Heading1</Typography>
      <Typography type="heading2">Heading2</Typography>
      <Typography type="heading3">Heading3</Typography>
      <Typography type="heading4">Heading4</Typography>
      <Typography type="body1">Body1</Typography>
      <Typography type="body2">Body2</Typography>
      <Table />
    </div>
  );
}

export default Test;
