export interface InquiryDetailImage {
  url: string
  alt?: string
}

export interface InquiryDetailAmenity {
  label: string
  icon: string
}

export interface InquiryDetailData {
  _id: string
  apartmentName: string
  city: string
  status: 'Responded' | 'Pending' | 'Closed'
  date: string
  mainImage: string
  thumbnailImages: InquiryDetailImage[]
  area: string
  rooms: number
  balcony: boolean
  availableFrom: string
  description: string
  descriptionParagraphs: string[]
  amenities: InquiryDetailAmenity[]
  whyChoose: string[]
}
