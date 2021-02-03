import React from "react";
import "./style.scss";

const Typography = ({
  type,
  children,
  gutterBottom,
  className,
  otherProps
}) => {
  const classNameMap = {
    heading1: 'heading1',
    heading2: 'heading2',
    heading3: 'heading3',
    heading4: 'heading4',
    title: 'title1',
    title2: 'title2',
    body1: 'body1',
    body2: 'body2'
  }
  return (
    <div
      className={`oe-typography ${classNameMap[type] || ''} ${gutterBottom ? 'gutter-bottom' : ''} ${className?className:''}`}
      {...otherProps}
    >
      { children }
    </div>
  );
}

export default Typography;
