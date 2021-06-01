/**
 * getFormType - used to get the type of input from server recieved data.
 * @param  {Object} prop
 */
const getFormType = (prop) => {
  switch (prop.type) {
    case "string":
      if (prop.suggestive === "true") {
        return "suggestiveInput";
      }
      if (Array.isArray(prop.allowedValues)) {
        return "dropdown";
      }
      if (prop.name === "description") {
        return "description";
      }
      if (prop.maxLen) {
        return 'textarea';
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

const titleCase = (str="") => str.split("_").map(item => item.charAt(0).toUpperCase() + item.substring(1)).join(" ");

const formOptionsData = ({ data, labelKey, valueKey }) => {
  if (Array.isArray(data)) {
    return data.map(item => ({
      label: labelKey ? item[labelKey] : item,
      value: valueKey ? item[valueKey] : item
    }))
  }

  return [];
}

export {
  getFormType,
  getExportMembersFileName,
  titleCase,
  formOptionsData
}
