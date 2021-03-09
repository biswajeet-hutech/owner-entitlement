
import { message } from "antd";
import jsPDF from "jspdf";
import "jspdf-autotable";

// import exportData from "../data/export-entitlement.json";

function extractContent(value){
  var div = document.createElement('div')
  div.innerHTML=value;
  var text= div.textContent;
  return text;
}

const decodeAndRemoveExtraQuoteFromString = (str) => {
  let decodedString = extractContent(str);
  if (decodedString.charAt(0) === '"' || decodedString.charAt(0) === "'") {
    return decodedString.slice(1, -1);
  }

  return decodedString;
}

const printToPDF = ({
  exportData,
  options
}) => {
  const {
    hideDetailsData = false,
    hideDetailsHeader = false,
    hideMembersHeader = false,
    hideMembersData = false,
    
  } = options;

  var totalPagesExp = "{total_pages_count_string}";
  try {
    const doc = new jsPDF('l', 'mm', [297, 210]);
    const commonTableProps = {
      headStyles: {
        fontSize: 5,
        fontStyle: "normal",
        fillColor: "#44495b"
      },
      bodyStyles: {
        fontSize: 5,
        textAlign: "center",
        valign: "middle",
      }
    };

    doc.setFontSize(10);
    let finalY = doc.lastAutoTable.finalY || 10;

    const entitlementDetailsHead = !hideDetailsHeader ? [exportData?.Entitlement?.headers.filter(item => item !== "id")] : [];
    const entitlementDetailsBody = [];
    const entitlementMembersHead = !hideMembersHeader ? [exportData?.Members?.headers] : [];
    const entitlementMembersBody = [];
    
    if (!hideDetailsData) {
      if (Array.isArray(exportData?.Entitlement?.EntitlementDetails)) {
        exportData?.Entitlement?.EntitlementDetails.forEach(row => {
          const localResult = [];
          entitlementDetailsHead[0]?.forEach(head => {
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
      doc.text(`Entitlement Details`, 15, finalY + 10);
      doc.autoTable({
        ...commonTableProps,
        head: entitlementDetailsHead,
        body: entitlementDetailsBody,
        startY: finalY + 15,
      });
    }

    if (!hideMembersData || !hideMembersHeader) {
      finalY = doc.lastAutoTable.finalY;
      doc.text(`Entitlement Members`, 15, finalY + 10);
      doc.autoTable({
        ...commonTableProps,
        head: entitlementMembersHead,
        body: entitlementMembersBody,
        startY: finalY + 15,
        tableWidth: 'auto',
      });
    }

    if (typeof doc.putTotalPages === "function") {
      doc.putTotalPages(totalPagesExp);
    }
    doc.save("entitlement-details.pdf");
  } catch (err) {
    console.log(err);
    message.error("Unable to Print");
  }
};

export {
  printToPDF
}
