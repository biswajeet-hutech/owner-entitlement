import React from "react";
import { Button, Grid, Tooltip } from 'antd';
import { EllipsisOutlined } from '@ant-design/icons';
import { ViewIcon, EditIcon, DisputeIcon, ExportCertIcon, ExportCertHoverIcon, ViewHoverIcon, EditHoverIcon, DisputeHoverIcon, DisputeModal, EditModal, ViewModal } from './../../assets';
import Modal from '../../components/modal';
import ActionDialog from '../../components/action-dialog';
import "./style.scss";
import EntitlementDetailsWrapper from "../entitlement-details-wrapper";
import RaiseDispute from "../raise-dispute";

const { useBreakpoint } = Grid;

const ResponsiveActionIcons = ({
  data = {},
  onAction = () => { }
}) => {
  const [openModal, setOpenModal] = React.useState({ show: false, edit: false });
  const [openDisputeModal, setOpenDisputeModal] = React.useState(false);
  const [actionModalConfig, setActionModalConfig] = React.useState({
    show: false,
    type: '',
    origin: ''
  })

  const getActionDialogConfig = ({ origin, type, text }) => {
    switch (origin) {
      case 'dispute':
        return {
          type: type,
          title: type === 'success' ? 'Dispute Raised!' : 'Error',
          subTitle: type === 'success' ? '' : (text || 'Unable to raise dispute.')
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
        <Button type="text" className="oe-icon-btn" onClick={() => setOpenModal({ show: true, edit: false })} icon={
          <>
            <ViewIcon className="normal" />
            <ViewHoverIcon className="hover" />
          </>
        }></Button>
      </Tooltip>
      <Tooltip title="Edit" placement="bottom">
        <div className="oe-icon-btn" onClick={() => setOpenModal({ show: true, edit: true })}>
          <EditIcon className="normal" />
          <EditHoverIcon className="hover" />
        </div>
      </Tooltip>
      <Tooltip title="Export Members" placement="bottom">
        <div className="oe-icon-btn" onClick={() => onAction('export', data)}>
          <ExportCertIcon style={{ transform: 'rotate(-45deg)', fontSize: 12 }} className="normal" />
          <ExportCertHoverIcon style={{ transform: 'rotate(-45deg)', fontSize: 12 }} className="hover" />
        </div>
      </Tooltip>
      <Tooltip title="Raise Dispute" placement="bottom" onClick={() => setOpenDisputeModal(true)}>
        <div className="oe-icon-btn">
          <DisputeIcon className="normal" />
          <DisputeHoverIcon className="hover" />
        </div>
      </Tooltip>
      <Modal open={openModal.show} onHide={() => setOpenModal({ show: false, edit: false })} footer={openModal.edit ? undefined : null} title={<>{openModal.edit ? (<EditModal />) : (<ViewModal />)}<span>{`${openModal.edit ? 'Edit' : 'View'} Details - ${data.displayName || data.value}`}</span></>}>
        <EntitlementDetailsWrapper
          defaultActiveKey="2"
          entitlementId={data.id}
          editMode={openModal.edit}
          onClose={() => { setOpenModal({ show: false, edit: false }) }}
          onSuccess={() => { setOpenModal({ show: false, edit: false }); onAction('edit_success') }}
        />
      </Modal>
      <Modal open={openDisputeModal} onHide={() => setOpenDisputeModal(false)} title={<><DisputeModal /> <span>{data.displayName || data.value} - Raise Dispute</span></>}>
        <RaiseDispute
          entitlementData={data}
          onHide={() => setOpenDisputeModal(false)}
          onSuccess={() => { setOpenDisputeModal(false); setActionModalConfig({ show: true, type: 'success', origin: 'dispute' }); }}
          onError={(errorMessage) => { setOpenDisputeModal(false); setActionModalConfig({ show: true, type: 'error', origin: 'dispute', text: errorMessage }) }}
        />
      </Modal>
      <ActionDialog open={actionModalConfig.show} onHide={() => { setActionModalConfig({ show: false, type: '' }); onAction('dispute') }} {...getActionDialogConfig(actionModalConfig)} />
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
