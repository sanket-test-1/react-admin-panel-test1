import { STORAGE_KEY, FILTER_TYPES, STATUS } from "../constant/common";
import { apiClient } from "./client";
import { API_URLS, UPLOAD_URL } from "./config";

export const loadOptions = async (data, inpuValue, callBack) => {
  if (inpuValue?.trim()?.length >= 1) {
    let res;
    try {
      res = await apiClient({
        url: API_URLS[data.ref].list,
        data: {
          query: {
            [data.displayAttribute]: {
              $regex: inpuValue.trim(),
              $options: "i"
            },
            isActive: true,
            isDeleted: false
          }
        }
      });
      callBack(res?.data?.data || []);
    } catch (error) {
      console.log("error: ", error);
      callBack([]);
    }
  } else {
    callBack([]);
  }
};

export const handleUpload = (fileList, setImages) => {
  apiClient({
    url: UPLOAD_URL,
    data: fileList,
    noHeaders: true
  })
    .then(data => {
      if (data?.data) {
        setImages(
          data?.data?.uploadSuccess?.map(
            img => process.env.REACT_APP_SERVICE_URL + img?.path
          )
        );
      }
    })
    .catch(err => console.log(err));
};
const getAttributesForPopulate = item => {
  if (item?.mergeFields?.length) {
    const mergeFields = [...item?.mergeFields];
    mergeFields.push(item.displayAttribute);
    return mergeFields;
  }
  return item.displayAttribute;
};

export const getSchemaOptions = (schema, sortBy) => {
  const queryObj = {};
  if (sortBy && Array.isArray(sortBy) && sortBy.length > 0) {
    queryObj["sort"] = {};
    sortBy.forEach(col => {
      queryObj["sort"][col.id] = col.desc ? -1 : 1;
    });
  }

  let relations = schema.attributes.filter(item => item.type === "ObjectId");
  if (relations && relations.length > 0) {
    queryObj["populate"] = relations.map(item => ({
      path: item.attrName,
      select: getAttributesForPopulate(item)
    }));
  }
  return queryObj;
};

export const generateQueryFromFilters = filters => {
  const result = {};
  if (filters && Array.isArray(filters) && filters.length > 0) {
    result["$and"] = filters.map(filter => {
      switch (filter?.type) {
        case FILTER_TYPES.CONTAINS:
          return {
            [filter?.q1]: {
              $regex: filter?.q2,
              $options: "i"
            }
          };

        case FILTER_TYPES.INCLUDES:
          return {
            [filter?.q1]: {
              $in: Array.isArray(filter?.q2) ? [...filter?.q2] : [filter?.q2]
            }
          };

        case FILTER_TYPES.NOT_INCLUDES:
          return {
            [filter?.q1]: {
              $nin: Array.isArray(filter?.q2) ? [...filter?.q2] : [filter?.q2]
            }
          };

        case FILTER_TYPES.EQUALS:
          return {
            [filter?.q1]: {
              $eq: filter?.q2
            }
          };

        case FILTER_TYPES.NOT_EQUALS:
          return {
            [filter?.q1]: {
              $ne: filter?.q2
            }
          };

        case FILTER_TYPES.GREATER_THAN:
          return {
            [filter?.q1]: {
              $gt: filter?.q2
            }
          };

        case FILTER_TYPES.LESS_THAN:
          return {
            [filter?.q1]: {
              $lt: filter?.q2
            }
          };

        case FILTER_TYPES.GT_EQUAL_TO:
          return {
            [filter?.q1]: {
              $gte: filter?.q2
            }
          };

        case FILTER_TYPES.LT_EQUAL_TO:
          return {
            [filter?.q1]: {
              $lte: filter?.q2
            }
          };

        default:
          return {
            [filter?.accessor]: {
              $regex: filter?.q2,
              $options: "i"
            }
          };
      }
    });
  }
  return result;
};

export const loginService = (email, password) => {
  return new Promise((resolve, reject) => {
    apiClient({
      url: API_URLS.auth.login,
      data: { username: email, password, includeRoleAccess: false }
    })
      .then(res => {
        if (res?.data?.token) {
          resolve({ user: res.data, token: res.data.token });
        }
        reject(res?.message || "Something went wrong.");
      })
      .catch(error => {
        reject(error?.data?.message);
      });
  });
};

export const logoutService = () => {
  return new Promise((resolve, reject) => {
    apiClient({
      url: API_URLS.auth.logout
    })
      .then(res => {
        if (res.status === STATUS.SUCCESS) {
          resolve("Logout Successfully");
        }
        reject(res?.message || "Something went wrong.");
      })
      .catch(error => {
        reject(error?.data?.message);
      });
  });
};

export const changePasswordService = data => {
  return new Promise((resolve, reject) => {
    apiClient({
      method: "PUT",
      url: API_URLS.auth.changePassword,
      data
    })
      .then(res => {
        if (res.status === STATUS.SUCCESS) {
          resolve("Password changed Successfully");
        } else {
          reject(res.message);
        }
      })
      .catch(error => {
        reject(error?.data?.message || "Invalid old password");
      });
  });
};

export const forgotPasswordService = data => {
  return new Promise((resolve, reject) => {
    apiClient({ url: API_URLS.auth.forgotPassword, data })
      .then(res => {
        if (res.status === STATUS.SUCCESS) {
          resolve(res?.message);
        } else {
          reject(res?.message || res.data);
        }
      })
      .catch(err => reject(err?.data?.message || "Something went wrong."));
  });
};

export const updateProfileService = data => {
  return new Promise((resolve, reject) => {
    apiClient({
      method: "PUT",
      url: API_URLS.auth.updateProfile,
      data
    })
      .then(res => {
        if (res?.status === STATUS.SUCCESS) {
          resolve(res?.data || {});
        } else {
          reject(res?.message);
        }
      })
      .catch(err => reject(err?.data?.message || "Something went wrong."));
  });
};

export const resetPasswordService = data => {
  return new Promise((resolve, reject) => {
    apiClient({
      method: "PUT",
      url: API_URLS.auth.resetPassword,
      data
    })
      .then(res => {
        if (res.status === STATUS.SUCCESS) {
          resolve(res.data);
        } else {
          reject(res?.message || res.data);
        }
      })
      .catch(err => reject(err?.data?.message || "Something went wrong."));
  });
};
