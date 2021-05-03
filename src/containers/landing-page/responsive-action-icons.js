import React from "react";
import { Badge, Button, Grid, Tooltip } from 'antd';
import { EllipsisOutlined } from '@ant-design/icons';

import {
  ViewIcon,
  EditIcon,
  DisputeIcon,
  ExportCertIcon,
  ExportCertHoverIcon,
  ViewHoverIcon,
  EditHoverIcon,
  DisputeHoverIcon,
  DisputeModal,
  EditModal,
  ViewModal,
  GroupMemberIcon,
  GroupMemberHoverIcon
} from '../../assets';
import Modal from '../../components/modal';
import ActionDialog from '../../components/action-dialog';
import "./style.scss";
import EntitlementDetailsWrapper from "../view-edit-entitlement-wrapper";
import RaiseDispute from "../raise-dispute";

const { useBreakpoint } = Grid;

const ResponsiveActionIcons = ({
  data = {},
  helpUrl = "",
  entitlementHeaders=[],
  onAction = () => { }
}) => {
  const [openModal, setOpenModal] = React.useState({ show: false, edit: false });
  const [showMembersModal, setShowMembersModal] = React.useState({ show: false, edit: false });
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
          title: type === 'success' ? 'Request Submitted!' : 'Error',
          subTitle: type === 'success' ? '' : (text || 'Error in submission.')
        };
      default:
        return {}
    }
  }

  React.useEffect(() => {
    if (openModal.action) {
      onAction(openModal.action);
    }
  }, [openModal]);

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
      <div style={{ marginRight: 20 }}>
        <Tooltip title={`Members: ${data.users}`} placement="bottom" onClick={() => setShowMembersModal({show: true})}>
          <Badge
            count={data.users}
            overflowCount={99}
            size="small"
            offset={data.users < 10 ? [4, 10] : [10, 10]}
            showZero={true}
          >
            <div className="oe-icon-btn">
              <GroupMemberIcon className="normal" width={18} height={18} />
              <GroupMemberHoverIcon className="hover" width={18} height={18} />
            </div>
          </Badge>
        </Tooltip>
      </div>
      <Modal
        open={openModal.show}
        onHide={() => setOpenModal({ show: false, edit: false })}
        footer={openModal.edit ? undefined : null}
        titleIcon={openModal.edit ? (<EditModal />) : (<ViewModal />)}
        helpUrl={helpUrl}
        title={<span>{`${openModal.edit ? 'Edit' : 'View'} Details`}</span>} subTitle={data.displayName || data.value}>
        <EntitlementDetailsWrapper
          defaultActiveKey="2"
          entitlementId={data.id}
          editMode={openModal.edit}
          onClose={() => { setOpenModal({ show: false, edit: false }) }}
          onSuccess={() => { setOpenModal({ show: false, edit: false, action: 'edit_success' })}}
        />
      </Modal>
      <Modal
        open={openDisputeModal}
        onHide={() => setOpenDisputeModal(false)}
        titleIcon={<DisputeModal />}
        title='Raise Dispute'
        helpUrl={helpUrl}
        subTitle={data.displayName || data.value}
      >
        <RaiseDispute
          entitlementData={data}
          onHide={() => setOpenDisputeModal(false)}
          onSuccess={() => { setOpenDisputeModal(false); setActionModalConfig({ show: true, type: 'success', origin: 'dispute' }); }}
          onError={(errorMessage) => { setOpenDisputeModal(false); setActionModalConfig({ show: true, type: 'error', origin: 'dispute', text: errorMessage }) }}
        />
      </Modal>
      <Modal
        open={showMembersModal.show}
        onHide={() => setShowMembersModal({ show: false, data: {} })}
        title={`Entitlement Members`}
        subTitle={data.displayName || data.value}
        helpUrl={helpUrl}
      >
        <EntitlementDetailsWrapper
          defaultActiveKey="1"
          entitlementDetailsHeader={entitlementHeaders}
          entitlementId={data.id}
          entitlementName={data.value || data.displayName}
          onClose={() => {
            setShowMembersModal({ show: false, data: {} });
          }}
          onSuccess={() => { setShowMembersModal({ show: false, edit: false, action: 'edit_success' })}}
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
