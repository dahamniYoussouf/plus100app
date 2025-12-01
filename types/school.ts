export interface Student {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  dateOfBirth: Date
  grade: string
  classId: string
  parentIds: string[]
  address: string
  photo?: string
}

export interface Parent {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  relationship: 'father' | 'mother' | 'guardian'
  studentIds: string[]
  address?: string
}

export interface Class {
  id: string
  name: string
  grade: string
  teacher: string
  schedule: string
  capacity: number
  currentStudents: number
  subject?: string
}

export interface Grade {
  id: string
  studentId: string
  subject: string
  score: number
  maxScore: number
  date: Date
  notes?: string
}


