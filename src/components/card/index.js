import React from "react";
import "./style.scss";
import {cards} from './../../assets/base64Images.json'
const Card = ({
  value,
  description,
  backGround
}) => {
  const maxCardDesignNo = 5; //total number of card design
  const colIndex = maxCardDesignNo >= backGround ? backGround : backGround % maxCardDesignNo;
  
  const backgroundImage = `url(${cards['col'+colIndex]})`;

  return (
   <div className="oe-card" style={{backgroundImage:backgroundImage}} key={description}>
    <div className={`oe-card-value ${(value+'').length > 3 ? 'big-card-value' : ''}`} title={value}>{value}</div>
    <div className="oe-card-desc" title={description}>{description.split(" ").slice(0,Math.ceil(description.split(" ").length/2)).join(" ")}<br/>{description.split(" ").slice(Math.ceil(description.split(" ").length/2)).join(" ")}</div>
   </div>
  );
}

export default Card;
