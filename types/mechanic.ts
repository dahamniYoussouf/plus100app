export interface Service {
  id: string
  name: string
  description: string
  category: 'engine' | 'brake' | 'tire' | 'oil' | 'electrical' | 'body' | 'inspection'
  price: number
  duration: number // in hours
  parts: string[]
}

export interface Appointment {
  id: string
  customerName: string
  customerPhone: string
  vehicleMake: string
  vehicleModel: string
  licensePlate: string
  serviceIds: string[]
  appointmentDate: Date
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled'
  notes?: string
  totalPrice: number
}

export interface Part {
  id: string
  name: string
  category: string
  stock: number
  price: number
  compatibleWith: string[]
}


