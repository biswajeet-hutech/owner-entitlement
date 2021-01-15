import React from "react";
import "./style.scss";
import {cards} from './../../assets/base64Images.json'
const Card = ({
  value,
  description
}) => {
  return (
   <div className="oe-card">
     <div className="oe-card-value">{value}</div>
  <div className="oe-card-desc">{description.split(" ")[0]}<br/>{description.split(" ").slice(1).join(" ")}</div>
   </div>
  );
}

export default Card;
