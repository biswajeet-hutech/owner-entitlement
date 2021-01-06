import React from "react";
import { Button as AntButton, Grid } from 'antd';

import "./style.scss";

const { useBreakpoint } = Grid;

const Button = ({
  children,
  leftIcon,
  rightIcon,
  type,
  onClick,
  className,
  size,
  ...otherProps
}) => {
  const screens = useBreakpoint();
  const btnClassNameMap = {
    primary: 'oe-btn-primary',
    secondary: 'oe-btn-secondary',
    hybrid: `${screens.xs ? 'oe-btn-secondary' : 'oe-btn-primary'} oe-btn-hybrid`
  }

  const btnClassNameMapWithSize = {
    large: 'oe-btn-large',
    small: 'oe-btn-small'
  }
  return (
    <AntButton className={`oe-btn ${btnClassNameMap[type] || ''} ${className || ''} ${btnClassNameMapWithSize[size] || ''}`} type={type} icon={leftIcon} onClick={onClick} {...otherProps}>
      { children }
      {rightIcon}
    </AntButton>
  );
}

export default Button;
