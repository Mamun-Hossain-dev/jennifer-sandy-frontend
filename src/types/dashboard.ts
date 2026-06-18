export interface ApiEnvelope<T> {
  message: string
  data: T
  meta?: PaginationMeta
}

export interface PaginationMeta {
  page: number
  limit: number
  total: number
}

export interface DashboardOverviewData {
  totalUser: number
  activeUser: number
  suspended: number
  totalEarning: number
}

export interface DashboardChartPoint {
  month: string
  totalRevenue: number
}

export interface DashboardChartData {
  year: number
  summary: {
    totalRevenue: number
  }
  chartData: DashboardChartPoint[]
}

export interface UserProfile {
  _id: string
  firstName: string
  lastName: string
  email: string
  role?: string
  gender?: 'male' | 'female'
  status?: 'active' | 'suspended'
  profilePicture?: string
  phoneNumber?: string
  bio?: string
  streetAddress?: string
  location?: string
  postalCode?: string
  createdAt?: string
  updatedAt?: string
  lastLogin?: string
}

export interface InquiryUserRef {
  firstName?: string
  lastName?: string
  email?: string
  phoneNumber?: string
}

export interface InquiryOfficeRef {
  _id?: string
  objekttitel?: string
}

export interface InquiryRecord {
  _id: string
  firstName: string
  lastName: string
  email: string
  phoneNumber: string
  message: string
  status?: string
  user?: InquiryUserRef | string
  onOfficeId?: InquiryOfficeRef | string
  createdAt?: string
  updatedAt?: string
}

export interface InquiryListResponse {
  data: InquiryRecord[]
  meta?: PaginationMeta
}

export interface UpdateProfilePayload {
  firstName: string
  lastName: string
  email: string
  phoneNumber?: string
  bio?: string
  streetAddress?: string
  location?: string
  postalCode?: string
  gender?: 'male' | 'female'
}

export interface ChangePasswordPayload {
  oldPassword: string
  newPassword: string
}
