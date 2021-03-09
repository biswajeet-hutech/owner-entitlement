
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

  const header = Array(headerLength).fill("");

  const result = [];
  result.push(header);

  const blankLineRow = [...Array(headerLength).fill("")];
  const entDetailsTitle = ["Entitlement Details", ...Array(headerLength - 1).fill("")];
  const entDetailsHeader = entitlementDetails?.headers.map(item => detailsHeaderMap[item] || item);
  const entDetailsBody = [];
  
  entitlementDetails?.headers.forEach(head => {
    entDetailsBody.push(entitlementDetails?.EntitlementDetails[head]);
  })

  const entMembersTitle = ["Entitlement Members", ...Array(headerLength - 1).fill("")];
  const entMembersHeader = entitleMembers?.headers.map(item => memberHeaderMap[item] || item);
  const entMembersBody = [];
  
  entitleMembers?.MemberDetails?.forEach(element => {
    const row = [];
    entitleMembers?.headers.forEach(head => {
      row.push(element[head]);
    })
    entMembersBody.push(row);
  });

  result.push(
    entDetailsTitle,
    blankLineRow,
    entDetailsHeader,
    entDetailsBody,
    blankLineRow,
    entMembersTitle,
    blankLineRow,
    entMembersHeader,
    ...entMembersBody
  );

  let csvContent = "data:text/csv;charset=utf-8," 
    + result.map(e => e.join(",")).join("\n");

  // return result;
  var encodedUri = encodeURI(csvContent);
  var link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "entitlement-details.csv");
  document.body.appendChild(link); // Required for FF
  link.click();
  document.body.removeChild(link);
}

export {
  getCombinedCSVData
}