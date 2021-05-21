import API, { localMode } from "../../api"

async function suggestiveValues(value, key) {
  const baseURL = '/EntitlementManagement/suggestive';
  return API.post(
    baseURL, {
      "fieldValue": value,
      "fieldName": key
    }
  ).then(response => {
    return response.data.map(user => ({
      label: user,
      value: user
    }))
  }).catch(error => {
    if (localMode) {
      return [
          "Leave Management System",
          "Test Leave"
        ].map(user => ({
          label: user,
          value: user
        }))
    } else {
      return [];
    }
  })
}

export {
  suggestiveValues
}
