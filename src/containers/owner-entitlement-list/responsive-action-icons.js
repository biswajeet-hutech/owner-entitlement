import React from "react";
import { Grid, Tooltip } from 'antd';
import { ExportOutlined, EyeOutlined, EditOutlined, SwapOutlined, EllipsisOutlined } from '@ant-design/icons';
import {ExportsIcon} from './../../assets'
import Modal from '../../components/modal';
import ActionDialog from '../../components/action-dialog';
import "./style.scss";
import EntitlementDetailsWrapper from "../entitlement-details-wrapper";
import RaiseDispute from "../raise-dispute";

const { useBreakpoint } = Grid;

const ResponsiveActionIcons = ({
  data={},
  onAction=()=> {}
}) => {
  const [openModal, setOpenModal] = React.useState({show: false, edit: false });
  const [openDisputeModal, setOpenDisputeModal] = React.useState(false);
  const [actionModalConfig, setActionModalConfig] = React.useState({
    show: false,
    type: '',
    origin: ''
  })

  const getActionDialogConfig = (origin, type) => {
    switch(origin) {
      case 'dispute':
        return {
          type: type,
          title: type === 'success' ? 'Dispute Raised!' : 'Something Went Wrong!',
          subTitle: type === 'success' ? '' : 'Some error occured while raising dispute. Please try again.'
        };
        default:
          return {}
    }
  }

  const smallScreenActions = (
    <EllipsisOutlined />
  );
  const bigScreenActions = (
    <div className="oe-icon-btn-wrapper">
      <Tooltip title="View" placement="bottom">
        <div className="oe-icon-btn" onClick={() => setOpenModal({show: true, edit: false })}>
          <EyeOutlined />
        </div>
      </Tooltip>
      <Tooltip title="Edit" placement="bottom">
        <div className="oe-icon-btn" onClick={() => setOpenModal({show: true, edit: true })}>
          <EditOutlined />
        </div>
      </Tooltip>
      <Tooltip title="Export" placement="bottom">
        <div className="oe-icon-btn">
          <ExportsIcon style={{ transform: 'rotate(-45deg)', fontSize: 12 }} onClick={() => onAction('export', data.id)} />
        </div>
      </Tooltip>
      <Tooltip title="Raise Dispute" placement="bottom" onClick={() => setOpenDisputeModal(true)}>
        <div className="oe-icon-btn">
          <SwapOutlined />
        </div>
      </Tooltip>
      <Modal open={openModal.show} onHide={() => setOpenModal({show: false, edit: false })} title={`${data.displayName || data.value} - ${openModal.edit ? 'Edit' : 'View'} Details`}>
        <EntitlementDetailsWrapper
          defaultActiveKey="2"
          entitlementId={data.id}
          editMode={openModal.edit}
          onClose={() => {setOpenModal({show: false, edit: false })}}
          onSuccess={() => {setOpenModal({show: false, edit: false }); onAction('edit_success')}}
        />
      </Modal>
      <Modal open={openDisputeModal} onHide={() => setOpenDisputeModal(false)} title={`${data.displayName || data.value} - Raise Dispute`}>
        <RaiseDispute
          entitlementData={data}
          onHide={() => setOpenDisputeModal(false)}
          onSuccess={() => {setOpenDisputeModal(false); setActionModalConfig({ show: true, type: 'success', origin: 'dispute' }); onAction('dispute')}}
          onError={() => {setOpenDisputeModal(false); setActionModalConfig({ show: true, type: 'error', origin: 'dispute' })}}
        />
      </Modal>
      <ActionDialog open={actionModalConfig.show} onHide={() => setActionModalConfig({ show: false, type: '' })} {...getActionDialogConfig(actionModalConfig.origin, actionModalConfig.type)} />
    </div>
  );

  const screens = useBreakpoint();
  if (screens.xs) {
    return smallScreenActions;
  } else {
    return bigScreenActions;
  }
}

export default ResponsiveActionIcons;
