import axios from "axios";

export const getUserEntries = async (userId, controllerSignal) => {
    try {
        const response = await axios.get(`/api/user/entries/${userId}`, {signal: controllerSignal})
        return response.data
    } catch (error) {
        console.log(error)
        throw error
    }
    
}

export const getUserEntry = async (entryId, controllerSignal = null) => {
    try {
        const response = await axios.get(`/api/entry/${entryId}`, {signal: controllerSignal})
        return response.data
    } catch (error) {
        console.log(error)
        throw error
    }
}

export const getUpdatedEntry = async (id, formData) => {
    const response = await  axios.put(`/api/entry/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } })
    return response
}