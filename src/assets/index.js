import { Tooltip } from 'antd';
import ImageUrls from './base64Images.json';

const Icon = ({dataUrl,width,height,alt}) =>{
    return <Tooltip title={alt?alt:dataUrl} placement="bottom">
        <img 
            src={dataUrl} 
            alt={alt?alt:dataUrl} 
            width={width?width:'22'}
            height={height?height:'22'}
        />
    </Tooltip>
}

const CheckTrue = ({width,height,alt}) => <Icon dataUrl={ImageUrls.requestable.true} width={width} height={height} alt={alt?alt:"True"}/>
const CheckFalse = ({width,height,alt}) => <Icon dataUrl={ImageUrls.requestable.false} width={width} height={height} alt={alt?alt:"False"}/>
const SearchIcon = ({width,height,alt}) => <Icon dataUrl={ImageUrls.icons.search} width={width?width:13} height={height?height:13} alt={alt?alt:"Search"}/>
const SettingIcon = ({width,height,alt}) => <Icon dataUrl={ImageUrls.icons.settings} width={width?width:16} height={height?height:16} alt={alt?alt:"Settings"}/>
const ExportsIcon = ({width,height,alt}) => <Icon dataUrl={ImageUrls.icons.export} width={width?width:16} height={height?height:16} alt={alt?alt:"Export"}/>
const InfoIcon = ({width,height,alt}) => <Icon dataUrl={ImageUrls.icons.info} width={width?width:11} height={height?height:11} alt={alt?alt:"Info"}/>
const ScheduleIcon = ({width,height,alt}) => <Icon dataUrl={ImageUrls.icons.info} width={width?width:16} height={height?height:16} alt={alt?alt:"Schedule"}/>
const ApprovedIcon = ({width,height,alt}) => <Icon dataUrl={ImageUrls.icons.approved} width={width?width:22} height={height?height:22} alt={alt?alt:"Approved"}/>
const RevokedIcon = ({width,height,alt}) => <Icon dataUrl={ImageUrls.icons.revoked} width={width?width:22} height={height?height:22} alt={alt?alt:"Revoked"}/>
const OpenIcon = ({width,height,alt}) => <Icon dataUrl={ImageUrls.icons.open} width={width?width:22} height={height?height:22} alt={alt?alt:"Open"}/>
const PendingIcon = ({width,height,alt}) => <Icon dataUrl={ImageUrls.icons.pending} width={width?width:22} height={height?height:22} alt={alt?alt:"Pending"}/>


const setCardBackgrounds = () =>{
    // const card = document.querySelector('.oe-card')
    // card.style.setProperty('card-one', ImageUrls.cards.col3)
}

export {
    CheckTrue,
    CheckFalse,
    SearchIcon,
    SettingIcon,
    ExportsIcon,
    InfoIcon,
    ScheduleIcon,
    ApprovedIcon,
    RevokedIcon,
    OpenIcon,
    PendingIcon,
    setCardBackgrounds
}