import React from "react";

import Card from '../../components/card';
import "./style.scss";

const CardWrapper = ({ cardData }) => (
  <div justify="space-between" className="oe-section oe-card-wrapper">
    {cardData.map(card => (
      <Card value={card.statVal} description={card.statDescription} />
    ))}
  </div>
)

export default CardWrapper;
