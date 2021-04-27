import dateFormat from "dateformat";
import { titleCase } from ".";

/**
 * Print Accumulated CSV report from members and entitlement details data
 * @param  {Object[]} data
 * @param  {Object[]} membersHeader
 * @param  {Object[]} detailsHeader
 */

function getCombinedCSVData({ data, membersHeader: memberHeaderDetails, detailsHeader=[] }) {
  const entitlementDetails = data.Entitlement;
  const entitleMembers = data.Members;

  const detailsHeaderMap = detailsHeader?.reduce((acc, header) => {
    acc[header.name] = header.displayName;
    return acc;
  }, {});

  const memberHeaderMap = memberHeaderDetails?.reduce((acc, header) => {
    acc[header.name] = header.displayName;
    return acc;
  }, {});

  const headerLength = Math.max(entitlementDetails?.headers?.length, entitleMembers?.headers?.length);
  let today = new Date();
  const formattedDate = dateFormat(today, "dddd mmmm dS yyyy h:MM TT Z");

  const header = [`Export Date: ${formattedDate}`, ...Array(headerLength-1).fill("")];

  const result = [];
  const blankLineRow = [...Array(headerLength).fill("")];
  const entDetailsTitle = ["Entitlement Details", ...Array(headerLength - 1).fill("")];
  const entDetailsHeader = entitlementDetails?.headers.map(item => detailsHeaderMap[item] || titleCase(item));
  const entDetailsBody = [];
  
  const entMembersTitle = ["Entitlement Members", ...Array(headerLength - 1).fill("")];
  const entMembersHeader = entitleMembers?.headers.map(item => memberHeaderMap[item] || titleCase(item));
  const entMembersBody = [];

  entitlementDetails?.headers.forEach(head => {
    entDetailsBody.push(entitlementDetails?.EntitlementDetails[head]);
  })
  
  entitleMembers?.MemberDetails?.forEach(element => {
    const row = [];
    entitleMembers?.headers.forEach(head => {
      row.push(element[head]);
    })
    entMembersBody.push(row);
  });

  result.push(
    header,
    blankLineRow,
    entDetailsTitle,
    entDetailsHeader,
    entDetailsBody,
    blankLineRow,
    entMembersTitle,
    entMembersHeader,
    ...entMembersBody
  );

  let csvContent = "data:text/csv;charset=utf-8," 
    + result.map(e => e.join(",")).join("\n");

  // return result;
  var encodedUri = encodeURI(csvContent);
  var link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "Entitlement-Member-Details.csv");
  document.body.appendChild(link); // Required for FF
  link.click();
  document.body.removeChild(link);
}

const exportCSVData = (header, data, filename="Entitlement-Details.csv") => {

  const result = [];
  // const firstRow = [`Date: ${new Date()}`, ...Array(header.length-1).fill("")];
  // const blankLineRow = [...Array(header.length).fill("")];
  const bodyRowData = [];
  
  data?.forEach(element => {
    const row = [];
    header.forEach(head => {
      row.push(element[head]);
    })
    bodyRowData.push(row);
  });

  result.push(
    header,
    ...bodyRowData
  )

  let csvContent = "data:text/csv;charset=utf-8," 
    + result.map(e => e.join(",")).join("\n");

  // return result;
  var encodedUri = encodeURI(csvContent);
  var link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", filename);
  document.body.appendChild(link); // Required for FF
  link.click();
  document.body.removeChild(link);
}

export {
  getCombinedCSVData,
  exportCSVData
}