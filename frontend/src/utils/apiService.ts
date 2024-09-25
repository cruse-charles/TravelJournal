import axios from "axios";
import { FormValues as EntryResponse } from "../pages/Entry/types";

// Retrieve all entries for a user
export const getUserEntries = async (userId: string, controllerSignal: AbortSignal) => {
  try {
    const response = await axios.get(`/api/user/entries/${userId}`, { signal: controllerSignal })
    return response.data
  } catch (error) {
    console.log(error)
    throw error
  }

}

// Retrieve a user's entry by EntryId
export const getUserEntry = async (entryId: string, controllerSignal: AbortSignal) => {
  try {
    const response = await axios.get<EntryResponse>(`/api/entry/${entryId}`, { signal: controllerSignal })
    return response.data
  } catch (error) {
    console.log(error)
    throw error
  }
}

// Update an entry
export const getUpdatedEntry = async (id: string, formData: FormData) => {
  console.log('updating entry', formData)
  const response = await axios.put(`/api/entry/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } })
  return response
}

// Delete an entry
export const deleteEntry = async (id: string) => {
  try {
    await axios.delete(`/api/entry/${id}`)
    console.log('entry deleted')
    return
  } catch (error) {
    console.log(error)
    throw error
  }

}