export interface Room {
  id: string
  number: string
  type: 'single' | 'double' | 'suite' | 'deluxe'
  floor: number
  price: number
  status: 'available' | 'occupied' | 'maintenance' | 'reserved'
  amenities: string[]
  maxGuests: number
}

export interface Reservation {
  id: string
  roomId: string
  guestName: string
  guestEmail: string
  guestPhone: string
  checkIn: Date
  checkOut: Date
  numberOfGuests: number
  totalPrice: number
  status: 'pending' | 'confirmed' | 'checked-in' | 'checked-out' | 'cancelled'
  paymentStatus: 'unpaid' | 'paid' | 'partial'
  specialRequests?: string
  createdAt: Date
}

export interface Service {
  id: string
  name: string
  description: string
  price: number
  category: 'food' | 'spa' | 'cleaning' | 'concierge' | 'other'
}


