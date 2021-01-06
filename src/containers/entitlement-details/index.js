import React from "react";

import './style.scss';
import Accordion from "../../components/accordion";
import BaseProperties from "./base-properties";
import ObjectAttributes from "./object-attributes";
import MembersPanel from "./members-panel";

function callback(key) {
  console.log(key);
}

const EntitlementDetails = ({
  editMode,
  data={}
}) => {
  const panelData = [{
    title: 'Base Properties',
    subTitle: 'View and edit standard properties',
    content: <BaseProperties data={data} readOnly={!editMode} />
  },
  // {
  //   title: 'Object Attribute',
  //   subTitle: ' ',
  //   content: <ObjectAttributes data={data.EntitlementDetails} readOnly={!editMode} />
  // }, {
  //   title: 'Members',
  //   subTitle: 'Add or remove members',
  //   content: <MembersPanel readOnly={!editMode} />
  // }
];

  // console.log(data);

  return (
    <div className="oe-ed-wrapper">
      <Accordion defaultActiveKey={['0', '1', '2']} panelData={panelData} />
    </div>
  );
}

export default EntitlementDetails;
