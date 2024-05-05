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