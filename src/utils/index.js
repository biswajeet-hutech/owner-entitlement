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

export {
  getFormType
}