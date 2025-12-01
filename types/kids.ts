export interface Child {
  id: string
  firstName: string
  lastName: string
  dateOfBirth: Date
  parentIds: string[]
  allergies?: string[]
  medications?: string[]
  emergencyContact: string
  emergencyPhone: string
  notes?: string
  photo?: string
}

export interface Activity {
  id: string
  name: string
  description: string
  category: 'educational' | 'sports' | 'art' | 'music' | 'outdoor' | 'indoor'
  ageRange: string
  duration: number // in minutes
  capacity: number
  enrolled: number
  schedule: string
}

export interface Attendance {
  id: string
  childId: string
  date: Date
  checkIn?: Date
  checkOut?: Date
  activities: string[]
  meals: string[]
  notes?: string
}


