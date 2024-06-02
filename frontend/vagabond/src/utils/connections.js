import axios from "axios";

const URL = process.env.REACT_APP_BACKEND_URL ?? "http://localhost:3001";

const service = (token) =>
  axios.create({
    baseURL: process.env.REACT_APP_BACKEND_URL ?? "http://localhost:3001",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

export const register = async (data) => {
  try {
    const response = await axios.post(`${URL}/api/register/`, data);
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 500) {
      return "duplicate_email";
    }
    console.log(error);
    return "error";
  }
};

export const createNewTrip = async (data, token) => {
  try {
    const response = await service(token).post("/api/travel/", data);
    console.log(response);
		return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const getUserTrips = async (token, uid) => {
	try {
		const response = await service(token).get('/api/travels/'+uid);
		return response.data;
	} catch (error) {
		console.log(error);
	}
};

export const getTrip = async (token, tid) => {
	try {
		const response = await service(token).get('/api/travel/'+tid);
		return response.data;
	} catch (error) {
		console.log(error);
	}
}

export const updateTrip = async (data, token, tid) => {
	try {
		const response = await service(token).patch('/api/travel/'+tid, data);
		return response.data;
	} catch (error) {
		console.log(error);
	}
}

export const deleteTrip = async (token, tid) => {
	try {
		const response = await service(token).delete('/api/travel/'+tid);
		return response.data;
	} catch (error) {
		console.log(error);
	}
}

export const getChecklist = async (token, checklistId) => {
  try {
	const response = await service(token).get('/api/checklist/'+checklistId);
	return response.data;
  } catch (error) {
	console.log(error)
  }
}