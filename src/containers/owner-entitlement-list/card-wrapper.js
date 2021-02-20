import React, { useEffect, useState } from "react";
// import Slider from "react-slick";
// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";
import Card from '../../components/card';
import { setCardBackgrounds } from './../../assets';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';

import "./style.scss";
import { Button } from "antd";

const CardWrapper = ({ cardData }) => {
  const [showLeftShadow, setLeftShadow] = useState(false);
  const [showRightShadow, setRightShadow] = useState(false);
  useEffect(() => {
    calculateShadow()
  }, [])

  let settings = {
    // dots: true,
    infinite: false,
    slidesToShow: 5,
    slidesToScroll: 1
  };
  const calculateShadow = () => {
    const ele = document.getElementById('cardWrapper')
    const scrollLeft = ele ? ele.scrollLeft : 0
    const scrollWidth = ele ? ele.scrollWidth : 0
    const offsetWidth = ele ? ele.offsetWidth : 0
    const rightSh = Math.round(offsetWidth + scrollLeft) === scrollWidth ? true : false
    setLeftShadow(scrollLeft !== 0 ? false : true)
    setRightShadow(rightSh)
  }

  return (
    <div justify="space-between" className="oe-section oe-card-wrapper">
      <Button type="text" icon={<LeftOutlined />} className={showLeftShadow ? "caroselArrows" : "caroselArrows showShadowa"} onClick={() => {
        document.getElementById('cardWrapper').scrollLeft -= 180
        calculateShadow()
      }} />
      <div className="card_carosel" id="cardWrapper">
        {cardData.map((card, index) => (
          <Card value={card.statVal} description={card.statDescription} backGround={index + 1} />
        ))}
      </div>
      <Button type="text" icon={<RightOutlined />} className={showRightShadow ? "caroselArrows" : "caroselArrows showShadowb"} onClick={() => {
        document.getElementById('cardWrapper').scrollLeft += 180
        calculateShadow()
      }} />


    </div>
  )
}

export default CardWrapper;
