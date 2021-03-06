import ImageUrls from './base64Images.json';
import strings from './strings.json';
import messages from "./messages";
import { Tooltip } from 'antd';

const Icon = ({ dataUrl, width, height, alt, className, tooltip }) => {
    const imageRender = (
        <img
            src={dataUrl}
            alt={alt ? alt : dataUrl}
            width={width ? width : '22'}
            height={height ? height : '22'}
            className={className ? className : ''}
        />
    )
    return tooltip ? (
        <Tooltip title={tooltip} placement="bottom">
            { imageRender }
        </Tooltip>
    ) : imageRender;
    
}

const CheckTrue = ({ width, height, alt, className }) => <Icon dataUrl={ImageUrls.requestable.true} width={width} height={height} alt={alt ? alt : "True"} className={className} />
const CheckFalse = ({ width, height, alt, className }) => <Icon dataUrl={ImageUrls.requestable.false} width={width} height={height} alt={alt ? alt : "False"} className={className} />
const SearchIcon = ({ width, height, alt, className }) => <Icon dataUrl={ImageUrls.icons.search} width={width ? width : 13} height={height ? height : 13} alt={alt ? alt : "Search"} className={className} />
const SettingIcon = ({ width, height, alt, className }) => <Icon dataUrl={ImageUrls.icons.settings} width={width ? width : 16} height={height ? height : 16} alt={alt ? alt : "Settings"} className={className} />
const ExportsIcon = ({ width, height, alt, className }) => <Icon dataUrl={ImageUrls.icons.export} width={width ? width : 16} height={height ? height : 16} alt={alt ? alt : "Export"} className={className} />
const InfoIcon = ({ width, height, alt, className }) => <Icon dataUrl={ImageUrls.icons.info} width={width ? width : 11} height={height ? height : 11} alt={alt ? alt : "Info"} className={className} />
const InfoHoverIcon = ({ width, height, alt, className }) => <Icon dataUrl={ImageUrls.icons.infoHover} width={width ? width : 11} height={height ? height : 11} alt={alt ? alt : "Info"} className={className} />
const ScheduleIcon = ({ width, height, alt, className }) => <Icon dataUrl={ImageUrls.icons.info} width={width ? width : 16} height={height ? height : 16} alt={alt ? alt : "Schedule"} className={className} />
const ApprovedIcon = ({ width, height, alt, className }) => <Icon dataUrl={ImageUrls.icons.approved} width={width ? width : 22} height={height ? height : 22} alt={alt ? alt : "Approved"} className={className} />
const RevokedIcon = ({ width, height, alt, className }) => <Icon dataUrl={ImageUrls.icons.revoked} width={width ? width : 22} height={height ? height : 22} alt={alt ? alt : "Revoked"} className={className} />
const NotCertifiedIcon = ({ width, height, alt, className }) => <Icon dataUrl={ImageUrls.icons.notCertified} width={width ? width : 22} height={height ? height : 22} alt={alt ? alt : "Not Certified"} className={className} />
const OpenIcon = ({ width, height, alt, className }) => <Icon dataUrl={ImageUrls.icons.open} width={width ? width : 22} height={height ? height : 22} alt={alt ? alt : "Open"} className={className} />
const PendingIcon = ({ width, height, alt, className }) => <Icon dataUrl={ImageUrls.icons.pending} width={width ? width : 22} height={height ? height : 22} alt={alt ? alt : "Pending"} className={className} />
const ViewIcon = ({ width, height, alt, className }) => <Icon dataUrl={ImageUrls.icons.view} width={width ? width : 16} height={height ? height : 16} alt={alt ? alt : "View"} className={className} />
const EditIcon = ({ width, height, alt, className }) => <Icon dataUrl={ImageUrls.icons.edit} width={width ? width : 16} height={height ? height : 16} alt={alt ? alt : "Edit"} className={className} />
const EditWhiteIcon = ({ width, height, alt, className }) => <Icon dataUrl={ImageUrls.icons.edit_white} width={width ? width : 16} height={height ? height : 16} alt={alt ? alt : "Edit"} className={className} />
const AddIcon = ({ width, height, alt, className }) => <Icon dataUrl={ImageUrls.icons.add} width={width ? width : 16} height={height ? height : 16} alt={alt ? alt : "Add"} className={className} />
const TickIcon = ({ width, height, alt, className }) => <Icon dataUrl={ImageUrls.icons.tick} width={width ? width : 16} height={height ? height : 16} alt={alt ? alt : "Tick"} className={className} />
const CloseIcon = ({ width, height, alt, className }) => <Icon dataUrl={ImageUrls.icons.close} width={width ? width : 16} height={height ? height : 16} alt={alt ? alt : "Close"} className={className} />
const DisputeIcon = ({ width, height, alt, className }) => <Icon dataUrl={ImageUrls.icons.dispute} width={width ? width : 16} height={height ? height : 16} alt={alt ? alt : "Dispute"} className={className} />
const ExportCertIcon = ({ width, height, alt, className }) => <Icon dataUrl={ImageUrls.icons.exportCert} width={width ? width : 16} height={height ? height : 16} alt={alt ? alt : "Export"} className={className} />
const ViewHoverIcon = ({ width, height, alt, className }) => <Icon dataUrl={ImageUrls.icons.viewhover} width={width ? width : 16} height={height ? height : 16} alt={alt ? alt : "View"} className={className} />
const EditHoverIcon = ({ width, height, alt, className }) => <Icon dataUrl={ImageUrls.icons.edithover} width={width ? width : 16} height={height ? height : 16} alt={alt ? alt : "Edit"} className={className} />
const DisputeHoverIcon = ({ width, height, alt, className }) => <Icon dataUrl={ImageUrls.icons.disputehover} width={width ? width : 16} height={height ? height : 16} alt={alt ? alt : "Dispute"} className={className} />
const ExportCertHoverIcon = ({ width, height, alt, className }) => <Icon dataUrl={ImageUrls.icons.exportCerthover} width={width ? width : 16} height={height ? height : 16} alt={alt ? alt : "Export"} className={className} />
const ExportHoverIcon = ({ width, height, alt, className }) => <Icon dataUrl={ImageUrls.icons.exportHover} width={width ? width : 16} height={height ? height : 16} alt={alt ? alt : "Export"} className={className} />
const HelpIcon = ({ width, height, alt, className }) => <Icon dataUrl={ImageUrls.icons.helpIcon} width={width ? width : 22} height={height ? height : 22} alt={alt ? alt : "Help"} className={className} />
const ViewModal = ({ width, height, alt, className }) => <Icon dataUrl={ImageUrls.icons.view_modal} width={width ? width : 25} height={height ? height : 20} alt={alt ? alt : "View"} className={className} />
const EditModal = ({ width, height, alt, className }) => <Icon dataUrl={ImageUrls.icons.edit_modal} width={width ? width : 25} height={height ? height : 20} alt={alt ? alt : "Edit"} className={className} />
const DisputeModal = ({ width, height, alt, className }) => <Icon dataUrl={ImageUrls.icons.dispute_modal} width={width ? width : 25} height={height ? height : 20} alt={alt ? alt : "Dispute"} className={className} />
const GroupMemberIcon = ({ width, height, alt, className }) => <Icon dataUrl={ImageUrls.icons.group} width={width ? width : 20} height={height ? height : 20} alt={alt ? alt : "Members"} className={className} />
const GroupMemberHoverIcon = ({ width, height, alt, className }) => <Icon dataUrl={ImageUrls.icons.group} width={width ? width : 20} height={height ? height : 20} alt={alt ? alt : "Members"} className={className} />
const backgroundImage = `url(${ImageUrls.backgroundImage})`

export {
    CheckTrue,
    CheckFalse,
    SearchIcon,
    SettingIcon,
    ExportsIcon,
    InfoIcon,
    InfoHoverIcon,
    ScheduleIcon,
    ApprovedIcon,
    RevokedIcon,
    NotCertifiedIcon,
    OpenIcon,
    PendingIcon,
    ViewIcon,
    EditIcon,
    EditWhiteIcon,
    AddIcon,
    TickIcon,
    CloseIcon,
    DisputeIcon,
    ViewHoverIcon,
    EditHoverIcon,
    DisputeHoverIcon,
    ExportHoverIcon,
    ExportCertHoverIcon,
    ExportCertIcon,
    HelpIcon,
    GroupMemberIcon,
    GroupMemberHoverIcon,
    backgroundImage,
    strings,
    ViewModal,
    EditModal,
    DisputeModal,
    messages
}