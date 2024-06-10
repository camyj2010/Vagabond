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
	const response = await service(token).get(`/api/checklist/${checklistId}`);
	return response.data;
  } catch (error) {
	console.log(error);
  }
};

export const toggleChecklistItem = async (token, checklistId, elementId, checked) => {
  try {
	const response = await service(token).patch(`/api/checklist/${checklistId}/${elementId}`, { checked });
	return response.data;
  } catch (error) {
	console.log(error);
  }
};

export const addCheckListItem = async (token, checklistId, element) => {
  try {
	const response = await service(token).post(`/api/checklist/${checklistId}`, { element });
	return response.data;
  } catch (error) {
	console.log(error);
  }
};

export const deleteChecklistItem = async (token, checklistId, elementId) => {
  try {
	const response = await service(token).delete(`/api/checklist/${checklistId}/${elementId}`);
	return response.data;
  } catch (error) {
	console.log(error);
  }
}

export const uploadImageToCloudinary = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', 'vagabond-preset');  
	
  try {
	const response = await axios.post('https://api.cloudinary.com/v1_1/ddlszjdgr/image/upload', formData, {
		headers: { 'Content-Type': 'multipart/form-data' }
	});
	return response.data.secure_url;
  } catch (error) {
	console.error("Error uploading image:", error);
	throw error;
};
  
export const foodDescription = async (token, data) => {
  try {
	const response = await service(token).post(`/api/food`, data);
	return response.data;
  } catch (error) {
	console.log(error);
  }
};

export const uploadAudio = async (token, audioData, languageAudio, languageObjetive)=> {
  try {
	const formData = new FormData();
    formData.append('audio', audioData);
    formData.append('languageObjetive', languageObjetive);
    formData.append('languageAudio', languageAudio);

    const response = await axios.post(`${URL}/api/voice/transcribe`, formData, {
	  headers: {
		'Authorization': `Bearer ${token}`,
		'Content-Type': 'multipart/form-data',
	  }
	})
	const path = response.data.audioUrl
	const audioResponse = await axios.get(`${URL}/api/voice/${path}`,{
	  responseType: 'arraybuffer', // Asegúrate de obtener la respuesta como un blob
	});
  
	return {
	  audio: audioResponse.data,
	  text: response.data.text
	};
  
	} catch (error) {
	  console.log(error);
	}
};