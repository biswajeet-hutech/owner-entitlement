import React from "react";
import Button from "../button";

const HelpButton = ({ helpUrl, className, style }) => (
  <Button type="primary" onClick={() => window.open(helpUrl,"_blank")} className={`oe-help-btn ${className || ''}`} style={style}>Help</Button>
);

export default HelpButton;
