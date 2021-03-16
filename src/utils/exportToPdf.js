
import { message } from "antd";
import jsPDF from "jspdf";
import "jspdf-autotable";
import dateFormat from "dateformat";
import { titleCase } from ".";


// import exportData from "../data/export-entitlement.json";

/**
 * @param  {string} value
 */
function extractContent(value){
  var div = document.createElement('div')
  div.innerHTML=value;
  var text= div.textContent;
  return text;
}

/**
 * used to remove extra quote from start and end of a string after removing escape charactes
 * @param  {} str
 */

const decodeAndRemoveExtraQuoteFromString = (str) => {
  let decodedString = extractContent(str);
  if (decodedString.charAt(0) === '"' || decodedString.charAt(0) === "'") {
    return decodedString.slice(1, -1);
  }

  return decodedString;
}

/**
 * printToPDF: Used to print PDF from entitlement object
 * @param  {Object[]} exportData
 * @param  {Object} options
 */

const printToPDF = ({
  exportData,
  options,
  detailsHeader=[],
  membersHeader=[],
  filename="Entitlement-Details"
}) => {
  const {
    hideDetailsData = false,
    hideDetailsHeader = false,
    hideMembersHeader = false,
    hideMembersData = false,
    
  } = options;

  const detailsHeaderMap = detailsHeader?.reduce((acc, header) => {
    acc[header.name] = header.displayName;
    return acc;
  }, {});

  const memberHeaderMap = membersHeader?.reduce((acc, header) => {
    acc[header.name] = header.displayName;
    return acc;
  }, {});

  var totalPagesExp = "{total_pages_count_string}";
  try {
    const doc = new jsPDF('l', 'mm', [297, 210]);

    doc.setFont('', 'bold', '500');
    const commonTableProps = {
      headStyles: {
        fontSize: 6,
        fontStyle: "bold",
        fillColor: "#037da1",
        textAlign: "center",
        valign: "middle",
      },
      bodyStyles: {
        fontSize: 5,
        textAlign: "center",
        valign: "middle",
      },
    };

    const footer = function(res) {
      let str = 'Page ' + res.pageCount;
      let height = doc.internal.pageSize.getHeight();
      var today = new Date();
      var newdat = dateFormat(today, "dddd, mmmm dS, yyyy, h:MM TT");

      if (typeof doc.putTotalPages === 'function') {
          str = str + ' of ' + totalPagesExp + '';
      }
      doc.setTextColor('#333333');
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.text(newdat, 15, height - 5);
      doc.text(str, 265, height - 5);
  };

    doc.setFontSize(10);
    let finalY = doc.lastAutoTable.finalY || 10;

    const entitlementDetailsHead = !hideDetailsHeader ? exportData?.Entitlement?.headers.filter(item => item !== "id") : [];
    const descriptionColumn = entitlementDetailsHead.indexOf('description');
    const approver2Column = entitlementDetailsHead.indexOf('approver_level2');
    const approver3Column = entitlementDetailsHead.indexOf('approver_level3');
    const entitlementDetailsHeadToShow = [entitlementDetailsHead.map(item => detailsHeaderMap[item] || titleCase(item))];
    const entitlementDetailsBody = [];
    const entitlementMembersHead = !hideMembersHeader ? exportData?.Members?.headers?.map(item => memberHeaderMap[item] || titleCase(item)) : [];
    const entitlementMembersHeadToShow = [entitlementMembersHead.map(item => memberHeaderMap[item] || item)];
    const entitlementMembersBody = [];
    
    if (!hideDetailsData) {
      if (Array.isArray(exportData?.Entitlement?.EntitlementDetails)) {
        exportData?.Entitlement?.EntitlementDetails.forEach(row => {
          const localResult = [];
          entitlementDetailsHead?.forEach(head => {
            localResult.push(decodeAndRemoveExtraQuoteFromString(row[head]));
          })
          entitlementDetailsBody.push(localResult);
        })
      } else {
        exportData?.Entitlement?.headers.forEach(head => {
          entitlementDetailsBody.push([head, decodeAndRemoveExtraQuoteFromString(exportData.Entitlement.EntitlementDetails[head])]);
        })
      }
    }

    if (!hideMembersData) {
      exportData?.Members?.MemberDetails?.forEach(ent => {
        const localResult = [];
        exportData?.Members?.headers?.forEach(head => {
          localResult.push(decodeAndRemoveExtraQuoteFromString(ent[head]));
        })
        entitlementMembersBody.push(localResult);
      });
    }

    if (!hideDetailsData || !hideDetailsHeader) {
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text(`Entitlement Details`, 15, finalY + 10);
      doc.autoTable({
        ...commonTableProps,
        head: !hideDetailsHeader && entitlementDetailsHeadToShow,
        body: entitlementDetailsBody,
        startY: finalY + 15,
        afterPageContent: footer,
        columnStyles: {
          0: {cellWidth: 20},
          [descriptionColumn]: {cellWidth: 30},
          [approver2Column]: {cellWidth: 15},
          [approver3Column]: {cellWidth: 15}
        }
      });
    }

    if (!hideMembersData || !hideMembersHeader) {
      finalY = doc.lastAutoTable.finalY;
      doc.text(`Entitlement Members`, 15, finalY + 10);
      doc.autoTable({
        ...commonTableProps,
        head: entitlementMembersHeadToShow,
        body: entitlementMembersBody,
        startY: finalY + 15,
        tableWidth: 'auto',
        afterPageContent: footer,
      });
    }

    if (typeof doc.putTotalPages === "function") {
      doc.putTotalPages(totalPagesExp);
    }
    doc.save(`${filename}.pdf`);
  } catch (err) {
    console.log(err);
    message.error("Unable to Print");
  }
};

export {
  printToPDF
}
