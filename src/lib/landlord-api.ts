import { axiosInstance } from '@/lib/axios'

export interface LandlordLeadPayload {
  firstName: string
  lastName: string
  email: string
  phoneNumber: string
  propertyAddress?: string
  propertyType?: string
  message?: string
}

export interface LandlordLeadResponse {
  message: string
  data: {
    _id: string
    firstName: string
    lastName: string
    email: string
    phoneNumber: string
    propertyAddress?: string
    propertyType?: string
    message?: string
    status?: string
    createdAt?: string
    updatedAt?: string
  }
}

export async function submitLandlordLead(data: LandlordLeadPayload) {
  const response = await axiosInstance.post<LandlordLeadResponse>('/landlord', data)
  return response.data
}
