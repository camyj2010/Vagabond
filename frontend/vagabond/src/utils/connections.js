import axios from 'axios';

const URL = process.env.REACT_APP_BACKEND_URL ?? "http://localhost:3001";

const service = (token) => axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL ?? "http://localhost:3001",
  headers: {
    "Content-Type": "application/json",
    Authorization:
      `Bearer ${token}`,
  },
})

export const register = async (data) => {
	try {
		const response = await axios.post(`${URL}/api/register`, data)
		return response.data
	} catch (error) {
	    if (error.response && error.response.status === 500) {
		  return 'duplicate_email';
	    }
	    console.log(error);
		return 'error';
	}
}

export const postExample = async (data, token) => {
	const response = await service(token).post('/example', data)
	return response.data
}