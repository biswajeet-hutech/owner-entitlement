import React, { useEffect } from "react";
// import Slider from "react-slick";
// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";
import Card from '../../components/card';
import {setCardBackgrounds} from './../../assets';
import "./style.scss";

const CardWrapper = ({ cardData }) => {
  let settings = {
    // dots: true,
    infinite: false,
    slidesToShow: 5,
    slidesToScroll: 1
  };
  return (
  <div justify="space-between" className="oe-section oe-card-wrapper">
    {cardData.map((card,index) => (
      <Card value={card.statVal} description={card.statDescription} backGround={index+1}/>
    ))}
  </div>
  )
}

export default CardWrapper;
