
import { message } from "antd";
import jsPDF from "jspdf";
import "jspdf-autotable";

// import exportData from "../data/export-entitlement.json";

const printToPDF = (exportData) => {
  var totalPagesExp = "{total_pages_count_string}";
  try {
    var pageMargin = 10;
    // var startYpos = pageMargin;
    const doc = new jsPDF();
    const commonTableProps = {
      headStyles: {
        fontSize: 8,
        fontStyle: "normal",
        fillColor: "#44495b",
        linheight: 30,
        minCellHeight: 8,
      },
      bodyStyles: {
        fontSize: 10,
        textAlign: "center",
        minCellHeight: 10,
        valign: "middle",
        rowHeight: 10,
      },
      // margin: {top: 10},
    };
    doc.setFontSize(10);
    var finalY = doc.lastAutoTable.finalY || 10;
    var pageNumber = doc.internal.getNumberOfPages()
    // const entitlementDetailsHead = [exportData.Entitlement.headers];
    const entitlementDetailsBody = [];
    exportData?.Entitlement?.headers.forEach(head => {
      entitlementDetailsBody.push([head, exportData.Entitlement.EntitlementDetails[head]]);
    })

    const entitlementMembersHead = [exportData?.Members?.headers];
    const entitlementMembersBody = [];
    
    exportData?.Members?.MemberDetails[0]?.MemberDetails?.forEach(ent => {
      const localResult = [];
      exportData?.Members?.headers?.forEach(head => {
        localResult.push(ent[head]);
      })
      entitlementMembersBody.push(localResult);
    });

    doc.text(`Entitlement Details`, 15, finalY + 10);
    doc.autoTable({
      ...commonTableProps,
      // head: entitlementDetailsHead,
      body: entitlementDetailsBody,
      startY: finalY + 15,
      tableWidth: 'auto',
    });
    // doc.setPage(pageNumber);

    finalY = doc.lastAutoTable.finalY;
    doc.text(`Entitlement Members`, 15, finalY + 10);
    doc.autoTable({
      ...commonTableProps,
      head: entitlementMembersHead,
      body: entitlementMembersBody,
      startY: finalY + 15,
      tableWidth: 'auto',
      // horizontalPageBreak: true,
    });
    if (typeof doc.putTotalPages === "function") {
      doc.putTotalPages(totalPagesExp);
    }
    doc.save("bill-register.pdf");
  } catch (err) {
    console.log(err);
    message.error("Unable to Print");
  }
};

export {
  printToPDF
}
