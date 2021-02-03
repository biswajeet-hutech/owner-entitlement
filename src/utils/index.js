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

const getExportMembersFileName = (name="") => name.split("CN=").slice(0, 2).join("").split(",").join("_").split(" ").join("_").concat("_Members");

export {
  getFormType,
  getExportMembersFileName
}
