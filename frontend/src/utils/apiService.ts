import axios from "axios";

type EntryResponse = {
  title: string;
  text: string;
  date: Date;
  attachments: (File | string)[];
  user: string
}

// get all entries for a user
export const getUserEntries = async (userId, controllerSignal) => {
  try {
    const response = await axios.get(`/api/user/entries/${userId}`, { signal: controllerSignal })
    return response.data
  } catch (error) {
    console.log(error)
    throw error
  }

}

// get a specific entry for a user
// export const getUserEntry = async (entryId, controllerSignal) => {
export const getUserEntry = async (entryId: string, controllerSignal: AbortSignal) => {
  try {
    // const response = await axios.get(`/api/entry/${entryId}`, { signal: controllerSignal })
    const response = await axios.get<EntryResponse>(`/api/entry/${entryId}`, { signal: controllerSignal })
    return response.data
  } catch (error) {
    console.log(error)
    throw error
  }
}

// update an entry
export const getUpdatedEntry = async (id, formData) => {
  const response = await axios.put(`/api/entry/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } })
  return response
}

// delete an entry
export const deleteEntry = async (id) => {
  try {
    await axios.delete(`/api/entry/${id}`)
    console.log('entry deleted')
    return
  } catch (error) {
    console.log(error)
    throw error
  }

}