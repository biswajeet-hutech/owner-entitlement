import React from "react";
import "./style.scss";
import {cards} from './../../assets/base64Images.json'
const Card = ({
  value,
  description,
  backGround
}) => {
  const backgroundImage = `url(${cards['col'+backGround]})`
  return (
   <div className="oe-card" style={{backgroundImage:backgroundImage}}>
     <div className="oe-card-value">{value}</div>
  <div className="oe-card-desc">{description.split(" ")[0]}<br/>{description.split(" ").slice(1).join(" ")}</div>
   </div>
  );
}

export default Card;
