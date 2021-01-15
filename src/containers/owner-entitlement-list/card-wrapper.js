import React, { useEffect } from "react";

import Card from '../../components/card';
import {setCardBackgrounds} from './../../assets'
import "./style.scss";

const CardWrapper = ({ cardData }) => {
  useEffect(()=>{
  },[])
  return (<div justify="space-between" className="oe-section oe-card-wrapper">
    {cardData.map((card,index) => (
      <Card value={card.statVal} description={card.statDescription} backGround={index+1}/>
    ))}
  </div>
  )
}

export default CardWrapper;
