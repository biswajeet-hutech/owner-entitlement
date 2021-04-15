import API, { localMode } from "../api";
import IdentitiesJSON from "../data/approver-data.json";

async function fetchUserList(username, showWorkgroup) {
  const baseURL = `EntitlementManagement/identities/search`;
  return API.post(baseURL, {
    param: username,
    onlyUsers: true
  }).then(response => {
    if (showWorkgroup) {
      return response.data.map(user => ({
        label: user.displayName || user.name,
        value: user.id,
        id: user.id,
        workgroup: user.workgroup === "true"
        }))
    } else {
      return response.data?.filter(item => item.workgroup !== "true").map(user => ({
        label: user.displayName || user.name,
        value: user.id,
        id: user.id,
        workgroup: user.workgroup === "true"
        }))
    }}
  ).catch(err => {
    if (localMode) {
      if (showWorkgroup) {
        return IdentitiesJSON.map(user => ({
          label: user.displayName || user.name,
          value: user.id,
          id: user.id,
          workgroup: user.workgroup === "true"
          }))
      } else {
        return IdentitiesJSON?.filter(item => item.workgroup !== "true").map(user => ({
          label: user.displayName || user.name,
          value: user.id,
          id: user.id,
          workgroup: user.workgroup === "true"
          }))
      }
    } else {
      return [];
    }
  });
}

export default fetchUserList;
export {
  fetchUserList
}