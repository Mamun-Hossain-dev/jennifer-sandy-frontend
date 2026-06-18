import { axiosInstance } from './axios'

export interface ContactPayload {
  fullName: string
  email: string
  phoneNumber: string
  message: string
}

export async function submitContact(data: ContactPayload) {
  const response = await axiosInstance.post('/contact', data)
  return response.data
}
