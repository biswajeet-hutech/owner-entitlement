import API, { localMode } from "../api";
import _ from "lodash";

async function fetchUserList(username, showWorkgroup, defaultValue) {
  const baseURL = `EntitlementManagement/identities/search`;
  return API.post(baseURL, {
    param: username
  }).then(response => {
    if (showWorkgroup) {
      const result = [];
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
        result.push(defaultValue);
      }
      return _.uniqBy([...res, ...result], 'id');
    } else {
      const result = [];
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
        result.push(defaultValue);
      }
      return _.uniqBy([...res, ...result], 'id');
    }}
  ).catch(err => {
    if (localMode) {
      import("../data/approver-data.json").then(jsonRes => {
        if (showWorkgroup) {
          const result = [];
          const res = [
            ...jsonRes.default.map(user => ({
              label: user.displayName || user.name,
              value: user.id,
              id: user.id,
              name: user.name,
              workgroup: user.workgroup === "true"
            }))
          ];
          if (!username && defaultValue) {
            result.push(defaultValue);
          }
          return _.uniqBy([...res, ...result], 'id');
        } else {
          const result = [];
          const res = [
            ...jsonRes.default?.filter(item => item.workgroup !== "true").map(user => ({
              label: user.displayName || user.name,
              value: user.id,
              id: user.id,
              name: user.name,
              workgroup: user.workgroup === "true"
              }))
          ];
          if (!username && defaultValue) {
            result.push(defaultValue);
          }
          return _.uniqBy([...res, ...result], 'id');
        }
      })
    } else {
      const res = [];
      if (!username && defaultValue) {
        res.push(defaultValue);
      }
      return res;
    }
  });
}

export default fetchUserList;
export {
  fetchUserList
}