export interface Mom {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  dueDate?: Date
  childrenIds: string[]
  healthInfo?: string
  emergencyContact: string
  address?: string
}

export interface Appointment {
  id: string
  momId: string
  type: 'prenatal' | 'postnatal' | 'consultation' | 'ultrasound' | 'checkup'
  date: Date
  doctor?: string
  notes?: string
  status: 'scheduled' | 'completed' | 'cancelled'
}

export interface Resource {
  id: string
  title: string
  category: 'nutrition' | 'exercise' | 'health' | 'parenting' | 'support'
  content: string
  tags: string[]
}

