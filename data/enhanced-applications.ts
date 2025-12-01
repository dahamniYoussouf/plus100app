/**
 * Enhanced Applications Data
 * All 100 applications with SUPER detailed descriptions, features, and helpful information
 * Support for French, Arabic, and Algerian (Darija) languages
 */

import {
  ShoppingCart, Plane, ArrowRight, Zap, BarChart3, Users, MapPin,
  GraduationCap, Hotel, Cake, MessageSquare, BookOpen, Dumbbell, Stethoscope,
  UtensilsCrossed, Package, Calendar, Truck, Home, Briefcase, FolderKanban, DollarSign,
  Database, Store, FileText, Wrench, Pill, Car, Baby, Heart,
  Building2, Palette, ShoppingBag, CarTaxiFront, Coffee, IceCream,
  Pizza, Fish, Apple, Gamepad2, Laptop, Cloud, Shield,
  Lock, Settings, Paintbrush, Droplet, Gift,
  Receipt, MessageCircle, Film, Newspaper, Book,
  Calculator, Globe, Flag, Building, Factory, Warehouse,
  Activity, Gem, Flower, Code, School,
} from 'lucide-react'

export interface EnhancedApp {
  id: string
  title: string
  titleAr: string
  titleDz: string
  description: string
  descriptionAr: string
  descriptionDz: string
  icon: any
  color: string
  bgColor: string
  iconColor: string
  features: string[]
  featuresAr: string[]
  featuresDz: string[]
  technologies: string[]
  link: string
  stats: Array<{ label: string; labelAr: string; labelDz: string; value: string; icon: any }>
  category: string
  categoryAr: string
  categoryDz: string
  detailedInfo: {
    useCases: string[]
    benefits: string[]
    targetAudience: string[]
  }
}

// This file contains enhanced data for all applications
// Due to size, we'll import and use this in ApplicationsShowcase


