export interface Destination {
  id: string
  name: string
  country: string
  city: string
  description: string
  image: string
  price: number
  duration: number // in days
  category: 'culture' | 'nature' | 'beach' | 'adventure' | 'city' | 'romantic'
  highlights: string[]
  included: string[]
  notIncluded: string[]
}

export interface Circuit {
  id: string
  name: string
  description: string
  destinations: string[] // Destination IDs
  duration: number // total days
  price: number
  maxParticipants: number
  currentParticipants: number
  startDate?: Date
  endDate?: Date
  status: 'draft' | 'published' | 'full' | 'completed' | 'cancelled'
  itinerary: ItineraryDay[]
  createdAt: Date
}

export interface ItineraryDay {
  day: number
  title: string
  description: string
  activities: string[]
  meals: string[]
  accommodation?: string
}

export interface Reservation {
  id: string
  circuitId: string
  clientName: string
  clientEmail: string
  clientPhone: string
  participants: number
  totalPrice: number
  status: 'pending' | 'confirmed' | 'paid' | 'cancelled'
  createdAt: Date
  notes?: string
}

export interface TravelGuide {
  id: string
  name: string
  email: string
  phone: string
  languages: string[]
  specialties: string[]
  rating: number
  available: boolean
}


