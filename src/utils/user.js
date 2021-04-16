import API, { localMode } from "../api";
import _ from "lodash";
import IdentitiesJSON from "../data/approver-data.json";

async function fetchUserList(username, showWorkgroup, defaultValue) {
  const baseURL = `EntitlementManagement/identities/search`;
  return API.post(baseURL, {
    param: username,
    // onlyUsers: true
  }).then(response => {
    if (showWorkgroup) {
      const res = [
        ...response.data.map(user => ({
          label: user.displayName || user.name,
          value: user.id,
          id: user.id,
          name: user.name,
          workgroup: user.workgroup === "true"
        }))
      ];
      if (!username && defaultValue) {
        res.push(defaultValue);
      }
      return _.uniqBy(res, 'id');
    } else {
      const res = [
        ...response.data?.filter(item => item.workgroup !== "true").map(user => ({
          label: user.displayName || user.name,
          value: user.id,
          id: user.id,
          name: user.name,
          workgroup: user.workgroup === "true"
          }))
      ];
      if (!username && defaultValue) {
        res.push(defaultValue);
      }
      return _.uniqBy(res, 'id');
    }}
  ).catch(err => {
    if (localMode) {
      if (showWorkgroup) {
        const res = [
          ...IdentitiesJSON.map(user => ({
            label: user.displayName || user.name,
            value: user.id,
            id: user.id,
            name: user.name,
            workgroup: user.workgroup === "true"
          }))
        ];
        if (!username && defaultValue) {
          res.push(defaultValue);
        }
        return _.uniqBy(res, 'id');
      } else {
        const res = [
          ...IdentitiesJSON?.filter(item => item.workgroup !== "true").map(user => ({
            label: user.displayName || user.name,
            value: user.id,
            id: user.id,
            name: user.name,
            workgroup: user.workgroup === "true"
            }))
        ];
        if (!username && defaultValue) {
          res.push(defaultValue);
        }
        return _.uniqBy(res, 'id');
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