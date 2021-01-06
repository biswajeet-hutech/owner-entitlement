import React from "react";
import "./style.scss";

const Card = ({
  value,
  description
}) => {
  return (
   <div className="oe-card">
     <div className="oe-card-value">{value}</div>
  <div className="oe-card-desc">{description}</div>
   </div>
  );
}

export default Card;
