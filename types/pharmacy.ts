export interface Medication {
  id: string
  name: string
  genericName?: string
  category: 'prescription' | 'otc' | 'vitamin' | 'supplement'
  dosage: string
  form: 'tablet' | 'capsule' | 'syrup' | 'injection' | 'cream' | 'drops'
  stock: number
  expiryDate: Date
  price: number
  cost: number
  prescriptionRequired: boolean
  barcode?: string
  manufacturer?: string
}

export interface Prescription {
  id: string
  patientName: string
  patientPhone: string
  doctorName: string
  medications: PrescriptionItem[]
  date: Date
  status: 'pending' | 'filled' | 'picked-up'
}

export interface PrescriptionItem {
  medicationId: string
  medicationName: string
  quantity: number
  dosage: string
  instructions: string
}




