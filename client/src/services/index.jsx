import axios from "axios";
// BackendUrl =>
export const serverUrl = "http://localhost:8000/heft";
////////////////

// Get Api =>
export const getApiRequest = async (endPoint) => {
    try {
        const res = await axios.get(serverUrl + endPoint, {
            headers: {
                "x-access-token": sessionStorage.getItem("token"),
            },
        });
        console.log("getApiRequest=>", res);
        return res.data;
    } catch (err) {
        console.log("getApiResponseErr=>", err);
    }
};
/////////////

// Post Api =>
export const postApiRequest = async (endPoint, params) => {
    try {
        const res = await axios.post(serverUrl + endPoint, params, {
            headers: {
                "x-access-token": sessionStorage.getItem("token"),
            },
        });
        console.log("postApiRequest=>", res);
        return res.data;
    } catch (err) {
        console.log("postApiResponseErr=>", err);
    }
};
//////////////

// Put Api =>
export const putApiRequest = async (endPoint, params) => {
    try {
        const res = await axios.put(serverUrl + endPoint, params, {
            headers: {
                "x-access-token": sessionStorage.getItem("token"),
            },
        });
        console.log("putApiRequest=>", res);
        return res.data;
    } catch (err) {
        console.log("postApiResponseErr=>", err);
    }
};
//////////////

// Delete Api =>
export const deleteApiRequest = async (endPoint) => {
    try {
        const res = await axios.delete(serverUrl + endPoint, {
            headers: {
                "x-access-token": sessionStorage.getItem("token"),
            },
        });
        console.log("deleteApiRequest=>", res);
        return res.data;
    } catch (err) {
        console.log("deleteApiResponseErr=>", err);
    }

};
////////////////
