/**
 * getFormType - used to get the type of input from server recieved data.
 * @param  {Object} prop
 */
const getFormType = (prop) => {
  switch (prop.type) {
    case "string":
      if (prop.allowedValues !== null) {
        return "dropdown";
      }
      return "input";
    case "date":
      return "datepicker";
    case "int":
      return "input";
    case "boolean":
      return "checkbox";
    case "sailpoint.object.Identity":
      return "object";
    default:
      return prop.type;
  }
};

/**
 * getExportMembersFileName
 * get the filename of export members csv file
 * @param  {string} name
 */

const getExportMembersFileName = (name="") => name.split("CN=").slice(0, 2).join("").split(",").join("_").split(" ").join("_").concat("_Members");

export {
  getFormType,
  getExportMembersFileName
}
