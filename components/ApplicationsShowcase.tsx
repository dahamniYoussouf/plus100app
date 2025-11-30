'use client'

import { motion, useInView } from 'framer-motion'
import { useRef, useState } from 'react'
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
import Link from 'next/link'

interface App {
  id: string
  title: string
  description: string
  icon: any
  color: string
  bgColor: string
  iconColor: string
  features: string[]
  technologies: string[]
  link: string
  stats: Array<{ label: string; value: string; icon: any }>
  category: string
}

const categories = [
  'Toutes',
  'Restaurant & Food',
  'Santé & Bien-être',
  'Éducation',
  'Business',
  'E-commerce',
  'Services',
  'Loisirs',
  'Transport',
  'Immobilier',
  'Technologie',
  'Finance',
  'Social',
  'Automobile',
  'Famille',
  'Événements',
]

export default function ApplicationsShowcase() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const [selectedCategory, setSelectedCategory] = useState('Toutes')

  const applications: App[] = [
    // Restaurant & Food (10)
    { id: 'pos', title: 'Système POS Restaurant', description: 'Gestion complète de restaurant avec menu, commandes, tables et paiements.', icon: ShoppingCart, color: 'from-blue-600 to-blue-700', bgColor: 'bg-blue-50', iconColor: 'text-blue-600', features: ['Menu', 'Commandes', 'Tables', 'Paiement', 'Dashboard'], technologies: ['Next.js', 'TypeScript'], link: '/pos', stats: [{ label: 'Tables', value: '12', icon: Users }], category: 'Restaurant & Food' },
    { id: 'bakery', title: 'Gestion Pâtisserie', description: 'Système complet pour pâtisserie avec produits, commandes et stock.', icon: Cake, color: 'from-pink-600 to-pink-700', bgColor: 'bg-pink-50', iconColor: 'text-pink-600', features: ['Produits', 'Commandes', 'Stock', 'Livraisons'], technologies: ['Next.js', 'TypeScript'], link: '/bakery', stats: [{ label: 'Produits', value: '∞', icon: Package }], category: 'Restaurant & Food' },
    { id: 'cafe', title: 'Gestion Café', description: 'Gestion de café avec menu, commandes et système de points de fidélité.', icon: Coffee, color: 'from-amber-600 to-amber-700', bgColor: 'bg-amber-50', iconColor: 'text-amber-600', features: ['Menu Café', 'Commandes', 'Fidélité'], technologies: ['Next.js'], link: '/cafe', stats: [{ label: 'Boissons', value: '50+', icon: Coffee }], category: 'Restaurant & Food' },
    { id: 'icecream', title: 'Gestion Glaceries', description: 'Gestion de glacerie avec parfums, commandes et stock.', icon: IceCream, color: 'from-cyan-600 to-cyan-700', bgColor: 'bg-cyan-50', iconColor: 'text-cyan-600', features: ['Parfums', 'Commandes', 'Stock'], technologies: ['Next.js'], link: '/icecream', stats: [{ label: 'Parfums', value: '30+', icon: IceCream }], category: 'Restaurant & Food' },
    { id: 'pizza', title: 'Gestion Pizzeria', description: 'Système complet pour pizzeria avec personnalisation et livraison.', icon: Pizza, color: 'from-red-600 to-red-700', bgColor: 'bg-red-50', iconColor: 'text-red-600', features: ['Pizzas', 'Personnalisation', 'Livraison'], technologies: ['Next.js'], link: '/pizza', stats: [{ label: 'Pizzas', value: '20+', icon: Pizza }], category: 'Restaurant & Food' },
    { id: 'sushi', title: 'Gestion Sushis', description: 'Gestion de restaurant de sushis avec menu et réservations.', icon: Fish, color: 'from-teal-600 to-teal-700', bgColor: 'bg-teal-50', iconColor: 'text-teal-600', features: ['Menu', 'Réservations', 'Commandes'], technologies: ['Next.js'], link: '/sushi', stats: [{ label: 'Plats', value: '40+', icon: Fish }], category: 'Restaurant & Food' },
    { id: 'fastfood', title: 'Gestion Fast-Food', description: 'Système de point de vente pour fast-food avec commande rapide.', icon: UtensilsCrossed, color: 'from-orange-600 to-orange-700', bgColor: 'bg-orange-50', iconColor: 'text-orange-600', features: ['Commandes', 'Drive', 'Stock'], technologies: ['Next.js'], link: '/fastfood', stats: [{ label: 'Menus', value: '25+', icon: UtensilsCrossed }], category: 'Restaurant & Food' },
    { id: 'foodtruck', title: 'Gestion Food Truck', description: 'Gestion mobile pour food truck avec localisation et commandes.', icon: Truck, color: 'from-yellow-600 to-yellow-700', bgColor: 'bg-yellow-50', iconColor: 'text-yellow-600', features: ['Localisation', 'Commandes', 'Stock'], technologies: ['Next.js'], link: '/foodtruck', stats: [{ label: 'Locations', value: '∞', icon: MapPin }], category: 'Restaurant & Food' },
    { id: 'catering', title: 'Gestion Traiteur', description: 'Gestion de service traiteur avec événements et menus.', icon: UtensilsCrossed, color: 'from-purple-600 to-purple-700', bgColor: 'bg-purple-50', iconColor: 'text-purple-600', features: ['Événements', 'Menus', 'Commandes'], technologies: ['Next.js'], link: '/catering', stats: [{ label: 'Événements', value: '∞', icon: Calendar }], category: 'Restaurant & Food' },
    { id: 'delivery', title: 'Gestion Livraison', description: 'Plateforme de livraison de nourriture multi-restaurants.', icon: CarTaxiFront, color: 'from-green-600 to-green-700', bgColor: 'bg-green-50', iconColor: 'text-green-600', features: ['Livraisons', 'Suivi', 'Paiements'], technologies: ['Next.js'], link: '/delivery', stats: [{ label: 'Restaurants', value: '∞', icon: Store }], category: 'Restaurant & Food' },

    // Santé & Bien-être (10)
    { id: 'pharmacy', title: 'Gestion Pharmacie', description: 'Gestion complète de pharmacie avec médicaments et ordonnances.', icon: Pill, color: 'from-green-600 to-green-700', bgColor: 'bg-green-50', iconColor: 'text-green-600', features: ['Médicaments', 'Ordonnances', 'Expiration'], technologies: ['Next.js'], link: '/pharmacy', stats: [{ label: 'Médicaments', value: '∞', icon: Pill }], category: 'Santé & Bien-être' },
    { id: 'clinic', title: 'Gestion Clinique', description: 'Système complet avec patients, rendez-vous et dossiers médicaux.', icon: Stethoscope, color: 'from-emerald-600 to-emerald-700', bgColor: 'bg-emerald-50', iconColor: 'text-emerald-600', features: ['Patients', 'RDV', 'Dossiers'], technologies: ['Next.js'], link: '/clinic', stats: [{ label: 'Patients', value: '∞', icon: Users }], category: 'Santé & Bien-être' },
    { id: 'gym', title: 'Gestion Fitness/Gym', description: 'Gestion de salle de sport avec membres et abonnements.', icon: Dumbbell, color: 'from-red-600 to-red-700', bgColor: 'bg-red-50', iconColor: 'text-red-600', features: ['Membres', 'Abonnements', 'Cours'], technologies: ['Next.js'], link: '/gym', stats: [{ label: 'Membres', value: '∞', icon: Users }], category: 'Santé & Bien-être' },
    { id: 'spa', title: 'Gestion Spa', description: 'Gestion de spa avec rendez-vous et services bien-être.', icon: Heart, color: 'from-rose-600 to-rose-700', bgColor: 'bg-rose-50', iconColor: 'text-rose-600', features: ['Services', 'RDV', 'Clients'], technologies: ['Next.js'], link: '/spa', stats: [{ label: 'Services', value: '20+', icon: Heart }], category: 'Santé & Bien-être' },
    { id: 'yoga', title: 'Gestion Yoga Studio', description: 'Gestion de studio de yoga avec cours et inscriptions.', icon: Activity, color: 'from-indigo-600 to-indigo-700', bgColor: 'bg-indigo-50', iconColor: 'text-indigo-600', features: ['Cours', 'Inscriptions', 'Planning'], technologies: ['Next.js'], link: '/yoga', stats: [{ label: 'Cours', value: '∞', icon: Calendar }], category: 'Santé & Bien-être' },
    { id: 'nutrition', title: 'Gestion Nutritionniste', description: 'Suivi nutritionnel avec plans alimentaires et consultations.', icon: Apple, color: 'from-lime-600 to-lime-700', bgColor: 'bg-lime-50', iconColor: 'text-lime-600', features: ['Clients', 'Plans', 'Suivi'], technologies: ['Next.js'], link: '/nutrition', stats: [{ label: 'Clients', value: '∞', icon: Users }], category: 'Santé & Bien-être' },
    { id: 'dentist', title: 'Gestion Dentiste', description: 'Gestion de cabinet dentaire avec patients et rendez-vous.', icon: Stethoscope, color: 'from-sky-600 to-sky-700', bgColor: 'bg-sky-50', iconColor: 'text-sky-600', features: ['Patients', 'RDV', 'Traitements'], technologies: ['Next.js'], link: '/dentist', stats: [{ label: 'Patients', value: '∞', icon: Users }], category: 'Santé & Bien-être' },
    { id: 'physio', title: 'Gestion Physiothérapeute', description: 'Gestion de cabinet de physiothérapie avec séances.', icon: Activity, color: 'from-teal-600 to-teal-700', bgColor: 'bg-teal-50', iconColor: 'text-teal-600', features: ['Patients', 'Séances', 'Exercices'], technologies: ['Next.js'], link: '/physio', stats: [{ label: 'Séances', value: '∞', icon: Calendar }], category: 'Santé & Bien-être' },
    { id: 'mental', title: 'Gestion Psychologue', description: 'Gestion de cabinet avec patients et séances.', icon: Heart, color: 'from-purple-600 to-purple-700', bgColor: 'bg-purple-50', iconColor: 'text-purple-600', features: ['Patients', 'Séances', 'Notes'], technologies: ['Next.js'], link: '/mental', stats: [{ label: 'Patients', value: '∞', icon: Users }], category: 'Santé & Bien-être' },
    { id: 'vet', title: 'Gestion Vétérinaire', description: 'Gestion de clinique vétérinaire avec animaux et consultations.', icon: Heart, color: 'from-pink-600 to-pink-700', bgColor: 'bg-pink-50', iconColor: 'text-pink-600', features: ['Animaux', 'Consultations', 'Vaccins'], technologies: ['Next.js'], link: '/vet', stats: [{ label: 'Animaux', value: '∞', icon: Heart }], category: 'Santé & Bien-être' },

    // Éducation (10)
    { id: 'school', title: 'Gestion École & Parents', description: 'Système complet avec étudiants, parents, classes et notes.', icon: GraduationCap, color: 'from-green-600 to-green-700', bgColor: 'bg-green-50', iconColor: 'text-green-600', features: ['Étudiants', 'Parents', 'Classes'], technologies: ['Next.js'], link: '/school', stats: [{ label: 'Étudiants', value: '∞', icon: Users }], category: 'Éducation' },
    { id: 'library', title: 'Gestion Bibliothèque', description: 'Gestion de bibliothèque avec livres et emprunts.', icon: BookOpen, color: 'from-teal-600 to-teal-700', bgColor: 'bg-teal-50', iconColor: 'text-teal-600', features: ['Livres', 'Emprunts', 'Membres'], technologies: ['Next.js'], link: '/library', stats: [{ label: 'Livres', value: '∞', icon: BookOpen }], category: 'Éducation' },
    { id: 'university', title: 'Gestion Université', description: 'Gestion universitaire avec cours, étudiants et examens.', icon: School, color: 'from-blue-600 to-blue-700', bgColor: 'bg-blue-50', iconColor: 'text-blue-600', features: ['Cours', 'Étudiants', 'Examens'], technologies: ['Next.js'], link: '/university', stats: [{ label: 'Étudiants', value: '∞', icon: Users }], category: 'Éducation' },
    { id: 'tutoring', title: 'Gestion Cours Particuliers', description: 'Plateforme de cours particuliers avec professeurs et élèves.', icon: BookOpen, color: 'from-violet-600 to-violet-700', bgColor: 'bg-violet-50', iconColor: 'text-violet-600', features: ['Professeurs', 'Élèves', 'Cours'], technologies: ['Next.js'], link: '/tutoring', stats: [{ label: 'Cours', value: '∞', icon: BookOpen }], category: 'Éducation' },
    { id: 'online', title: 'Plateforme E-Learning', description: 'Plateforme d\'apprentissage en ligne avec cours et quiz.', icon: Laptop, color: 'from-indigo-600 to-indigo-700', bgColor: 'bg-indigo-50', iconColor: 'text-indigo-600', features: ['Cours', 'Quiz', 'Certificats'], technologies: ['Next.js'], link: '/online', stats: [{ label: 'Cours', value: '∞', icon: BookOpen }], category: 'Éducation' },
    { id: 'kids', title: 'Gestion Enfants', description: 'Gestion des enfants avec activités et présence.', icon: Baby, color: 'from-pink-600 to-pink-700', bgColor: 'bg-pink-50', iconColor: 'text-pink-600', features: ['Enfants', 'Activités', 'Présence'], technologies: ['Next.js'], link: '/kids', stats: [{ label: 'Enfants', value: '∞', icon: Baby }], category: 'Éducation' },
    { id: 'kindergarten', title: 'Gestion Maternelle', description: 'Gestion de maternelle avec enfants et activités.', icon: Baby, color: 'from-yellow-600 to-yellow-700', bgColor: 'bg-yellow-50', iconColor: 'text-yellow-600', features: ['Enfants', 'Activités', 'Parents'], technologies: ['Next.js'], link: '/kindergarten', stats: [{ label: 'Enfants', value: '∞', icon: Baby }], category: 'Éducation' },
    { id: 'daycare', title: 'Gestion Garderie', description: 'Gestion de garderie avec planning et activités.', icon: Baby, color: 'from-cyan-600 to-cyan-700', bgColor: 'bg-cyan-50', iconColor: 'text-cyan-600', features: ['Enfants', 'Planning', 'Activités'], technologies: ['Next.js'], link: '/daycare', stats: [{ label: 'Enfants', value: '∞', icon: Baby }], category: 'Éducation' },
    { id: 'language', title: 'École de Langues', description: 'Gestion d\'école de langues avec cours et étudiants.', icon: Globe, color: 'from-emerald-600 to-emerald-700', bgColor: 'bg-emerald-50', iconColor: 'text-emerald-600', features: ['Cours', 'Étudiants', 'Niveaux'], technologies: ['Next.js'], link: '/language', stats: [{ label: 'Langues', value: '10+', icon: Globe }], category: 'Éducation' },
    { id: 'quran', title: 'École Coranique', description: 'Gestion d\'école coranique avec étudiants et cours religieux.', icon: Book, color: 'from-emerald-600 to-emerald-700', bgColor: 'bg-emerald-50', iconColor: 'text-emerald-600', features: ['Étudiants', 'Cours', 'Mémorisation'], technologies: ['Next.js'], link: '/quran', stats: [{ label: 'Étudiants', value: '∞', icon: Users }], category: 'Éducation' },
    { id: 'charity', title: 'Gestion Association Caritative', description: 'Gestion d\'association caritative avec dons et bénéficiaires.', icon: Heart, color: 'from-green-600 to-green-700', bgColor: 'bg-green-50', iconColor: 'text-green-600', features: ['Dons', 'Bénéficiaires', 'Projets'], technologies: ['Next.js'], link: '/charity', stats: [{ label: 'Projets', value: '∞', icon: Heart }], category: 'Services' },
    { id: 'mosque', title: 'Gestion Mosquée', description: 'Gestion de mosquée avec événements et services religieux.', icon: Building, color: 'from-blue-600 to-blue-700', bgColor: 'bg-blue-50', iconColor: 'text-blue-600', features: ['Événements', 'Services', 'Dons'], technologies: ['Next.js'], link: '/mosque', stats: [{ label: 'Services', value: '∞', icon: Calendar }], category: 'Services' },
    { id: 'halalfood', title: 'Certification Halal', description: 'Gestion de certification halal pour produits alimentaires.', icon: Shield, color: 'from-green-600 to-green-700', bgColor: 'bg-green-50', iconColor: 'text-green-600', features: ['Produits', 'Certifications', 'Contrôles'], technologies: ['Next.js'], link: '/halalfood', stats: [{ label: 'Produits', value: '∞', icon: Shield }], category: 'Business' },

    // Business & Services (20)
    { id: 'hardware', title: 'Gestion Quincaillerie', description: 'Gestion complète de quincaillerie avec inventaire et ventes.', icon: Wrench, color: 'from-blue-600 to-blue-700', bgColor: 'bg-blue-50', iconColor: 'text-blue-600', features: ['Produits', 'Inventaire', 'Ventes'], technologies: ['Next.js'], link: '/hardware', stats: [{ label: 'Produits', value: '∞', icon: Package }], category: 'Business' },
    { id: 'mechanic', title: 'Gestion Mécanique Auto', description: 'Gestion d\'atelier mécanique avec services et rendez-vous.', icon: Car, color: 'from-orange-600 to-orange-700', bgColor: 'bg-orange-50', iconColor: 'text-orange-600', features: ['Services', 'RDV', 'Pièces'], technologies: ['Next.js'], link: '/mechanic', stats: [{ label: 'Services', value: '∞', icon: Settings }], category: 'Services' },
    { id: 'hotel', title: 'Gestion Hôtel', description: 'Système complet avec chambres, réservations et services.', icon: Hotel, color: 'from-amber-600 to-amber-700', bgColor: 'bg-amber-50', iconColor: 'text-amber-600', features: ['Chambres', 'Réservations', 'Services'], technologies: ['Next.js'], link: '/hotel', stats: [{ label: 'Chambres', value: '20', icon: Hotel }], category: 'Services' },
    { id: 'travel', title: 'Gestion de Voyage', description: 'Agence de voyage avec circuits et réservations.', icon: Plane, color: 'from-purple-600 to-purple-700', bgColor: 'bg-purple-50', iconColor: 'text-purple-600', features: ['Destinations', 'Circuits', 'Réservations'], technologies: ['Next.js'], link: '/travel', stats: [{ label: 'Destinations', value: '3+', icon: MapPin }], category: 'Services' },
    { id: 'cleaning', title: 'Gestion Nettoyage', description: 'Gestion d\'entreprise de nettoyage avec équipes et missions.', icon: Droplet, color: 'from-blue-600 to-blue-700', bgColor: 'bg-blue-50', iconColor: 'text-blue-600', features: ['Équipes', 'Missions', 'Planning'], technologies: ['Next.js'], link: '/cleaning', stats: [{ label: 'Équipes', value: '∞', icon: Users }], category: 'Services' },
    { id: 'security', title: 'Gestion Sécurité', description: 'Gestion d\'entreprise de sécurité avec agents et missions.', icon: Shield, color: 'from-gray-600 to-gray-700', bgColor: 'bg-gray-50', iconColor: 'text-gray-600', features: ['Agents', 'Missions', 'Rondes'], technologies: ['Next.js'], link: '/security', stats: [{ label: 'Agents', value: '∞', icon: Users }], category: 'Services' },
    { id: 'plumber', title: 'Gestion Plomberie', description: 'Gestion d\'entreprise de plomberie avec interventions.', icon: Droplet, color: 'from-cyan-600 to-cyan-700', bgColor: 'bg-cyan-50', iconColor: 'text-cyan-600', features: ['Interventions', 'Clients', 'Planning'], technologies: ['Next.js'], link: '/plumber', stats: [{ label: 'Interventions', value: '∞', icon: Calendar }], category: 'Services' },
    { id: 'electrician', title: 'Gestion Électricité', description: 'Gestion d\'entreprise d\'électricité avec interventions.', icon: Zap, color: 'from-yellow-600 to-yellow-700', bgColor: 'bg-yellow-50', iconColor: 'text-yellow-600', features: ['Interventions', 'Clients', 'Devis'], technologies: ['Next.js'], link: '/electrician', stats: [{ label: 'Interventions', value: '∞', icon: Calendar }], category: 'Services' },
    { id: 'painter', title: 'Gestion Peinture', description: 'Gestion d\'entreprise de peinture avec projets et devis.', icon: Paintbrush, color: 'from-pink-600 to-pink-700', bgColor: 'bg-pink-50', iconColor: 'text-pink-600', features: ['Projets', 'Devis', 'Clients'], technologies: ['Next.js'], link: '/painter', stats: [{ label: 'Projets', value: '∞', icon: Palette }], category: 'Services' },
    { id: 'carpenter', title: 'Gestion Menuiserie', description: 'Gestion d\'atelier de menuiserie avec commandes.', icon: Wrench, color: 'from-amber-600 to-amber-700', bgColor: 'bg-amber-50', iconColor: 'text-amber-600', features: ['Commandes', 'Projets', 'Stock'], technologies: ['Next.js'], link: '/carpenter', stats: [{ label: 'Commandes', value: '∞', icon: ShoppingCart }], category: 'Services' },
    { id: 'hr', title: 'Gestion RH/Recrutement', description: 'Système RH avec employés, candidatures et congés.', icon: Briefcase, color: 'from-blue-600 to-blue-700', bgColor: 'bg-blue-50', iconColor: 'text-blue-600', features: ['Employés', 'Candidats', 'Congés'], technologies: ['Next.js'], link: '/hr', stats: [{ label: 'Employés', value: '∞', icon: Users }], category: 'Business' },
    { id: 'project', title: 'Gestion Projet', description: 'Gestion de projets avec tâches, équipes et deadlines.', icon: FolderKanban, color: 'from-rose-600 to-rose-700', bgColor: 'bg-rose-50', iconColor: 'text-rose-600', features: ['Projets', 'Tâches', 'Équipes'], technologies: ['Next.js'], link: '/project', stats: [{ label: 'Projets', value: '∞', icon: FolderKanban }], category: 'Business' },
    { id: 'crm', title: 'CRM - Gestion Clients', description: 'Système CRM avec contacts, opportunités et ventes.', icon: Users, color: 'from-indigo-600 to-indigo-700', bgColor: 'bg-indigo-50', iconColor: 'text-indigo-600', features: ['Contacts', 'Opportunités', 'Ventes'], technologies: ['Next.js'], link: '/crm', stats: [{ label: 'Contacts', value: '∞', icon: Users }], category: 'Business' },
    { id: 'inventory', title: 'Gestion Stock/Inventaire', description: 'Gestion d\'inventaire avec produits et mouvements.', icon: Package, color: 'from-cyan-600 to-cyan-700', bgColor: 'bg-cyan-50', iconColor: 'text-cyan-600', features: ['Produits', 'Stock', 'Mouvements'], technologies: ['Next.js'], link: '/inventory', stats: [{ label: 'Produits', value: '∞', icon: Package }], category: 'Business' },
    { id: 'warehouse', title: 'Gestion Entrepôt', description: 'Gestion d\'entrepôt avec stockage et expéditions.', icon: Warehouse, color: 'from-slate-600 to-slate-700', bgColor: 'bg-slate-50', iconColor: 'text-slate-600', features: ['Stockage', 'Expéditions', 'Inventaire'], technologies: ['Next.js'], link: '/warehouse', stats: [{ label: 'Zones', value: '∞', icon: Warehouse }], category: 'Business' },
    { id: 'factory', title: 'Gestion Usine', description: 'Gestion de production avec lignes et qualité.', icon: Factory, color: 'from-gray-600 to-gray-700', bgColor: 'bg-gray-50', iconColor: 'text-gray-600', features: ['Production', 'Lignes', 'Qualité'], technologies: ['Next.js'], link: '/factory', stats: [{ label: 'Lignes', value: '∞', icon: Settings }], category: 'Business' },
    { id: 'logistics', title: 'Gestion Logistique', description: 'Gestion logistique avec expéditions et transport.', icon: Truck, color: 'from-orange-600 to-orange-700', bgColor: 'bg-orange-50', iconColor: 'text-orange-600', features: ['Expéditions', 'Transport', 'Suivi'], technologies: ['Next.js'], link: '/logistics', stats: [{ label: 'Expéditions', value: '∞', icon: Truck }], category: 'Business' },
    { id: 'supplier', title: 'Gestion Fournisseurs', description: 'Gestion des relations avec fournisseurs et commandes.', icon: ShoppingBag, color: 'from-green-600 to-green-700', bgColor: 'bg-green-50', iconColor: 'text-green-600', features: ['Fournisseurs', 'Commandes', 'Paiements'], technologies: ['Next.js'], link: '/supplier', stats: [{ label: 'Fournisseurs', value: '∞', icon: Users }], category: 'Business' },
    { id: 'accounting', title: 'Comptabilité', description: 'Système de comptabilité avec comptes et transactions.', icon: Calculator, color: 'from-blue-600 to-blue-700', bgColor: 'bg-blue-50', iconColor: 'text-blue-600', features: ['Comptes', 'Transactions', 'Rapports'], technologies: ['Next.js'], link: '/accounting', stats: [{ label: 'Transactions', value: '∞', icon: Receipt }], category: 'Business' },
    { id: 'finance', title: 'Gestion Financière', description: 'Gestion financière avec budgets et analyses.', icon: DollarSign, color: 'from-green-600 to-green-700', bgColor: 'bg-green-50', iconColor: 'text-green-600', features: ['Budgets', 'Analyses', 'Rapports'], technologies: ['Next.js'], link: '/finance', stats: [{ label: 'Comptes', value: '∞', icon: DollarSign }], category: 'Business' },

    // E-commerce & Retail (10)
    { id: 'ecommerce', title: 'Gestion E-commerce', description: 'Plateforme e-commerce complète avec produits et commandes.', icon: Store, color: 'from-yellow-600 to-yellow-700', bgColor: 'bg-yellow-50', iconColor: 'text-yellow-600', features: ['Produits', 'Commandes', 'Clients'], technologies: ['Next.js'], link: '/ecommerce', stats: [{ label: 'Produits', value: '∞', icon: Package }], category: 'E-commerce' },
    { id: 'retail', title: 'Gestion Commerce Retail', description: 'Gestion de magasin retail avec ventes et stock.', icon: ShoppingBag, color: 'from-purple-600 to-purple-700', bgColor: 'bg-purple-50', iconColor: 'text-purple-600', features: ['Ventes', 'Stock', 'Clients'], technologies: ['Next.js'], link: '/retail', stats: [{ label: 'Ventes', value: '∞', icon: ShoppingCart }], category: 'E-commerce' },
    { id: 'fashion', title: 'Boutique Mode', description: 'Gestion de boutique de mode avec collections.', icon: ShoppingBag, color: 'from-pink-600 to-pink-700', bgColor: 'bg-pink-50', iconColor: 'text-pink-600', features: ['Collections', 'Stock', 'Commandes'], technologies: ['Next.js'], link: '/fashion', stats: [{ label: 'Produits', value: '∞', icon: Package }], category: 'E-commerce' },
    { id: 'jewelry', title: 'Bijouterie', description: 'Gestion de bijouterie avec bijoux et réparations.', icon: Gem, color: 'from-amber-600 to-amber-700', bgColor: 'bg-amber-50', iconColor: 'text-amber-600', features: ['Bijoux', 'Réparations', 'Ventes'], technologies: ['Next.js'], link: '/jewelry', stats: [{ label: 'Bijoux', value: '∞', icon: Gem }], category: 'E-commerce' },
    { id: 'electronics', title: 'Magasin Électronique', description: 'Gestion de magasin d\'électronique avec produits.', icon: Laptop, color: 'from-blue-600 to-blue-700', bgColor: 'bg-blue-50', iconColor: 'text-blue-600', features: ['Produits', 'Stock', 'Ventes'], technologies: ['Next.js'], link: '/electronics', stats: [{ label: 'Produits', value: '∞', icon: Laptop }], category: 'E-commerce' },
    { id: 'books', title: 'Librairie', description: 'Gestion de librairie avec livres et commandes.', icon: Book, color: 'from-red-600 to-red-700', bgColor: 'bg-red-50', iconColor: 'text-red-600', features: ['Livres', 'Commandes', 'Stock'], technologies: ['Next.js'], link: '/books', stats: [{ label: 'Livres', value: '∞', icon: Book }], category: 'E-commerce' },
    { id: 'toys', title: 'Magasin de Jouets', description: 'Gestion de magasin de jouets avec produits.', icon: Gamepad2, color: 'from-yellow-600 to-yellow-700', bgColor: 'bg-yellow-50', iconColor: 'text-yellow-600', features: ['Jouets', 'Stock', 'Ventes'], technologies: ['Next.js'], link: '/toys', stats: [{ label: 'Jouets', value: '∞', icon: Gamepad2 }], category: 'E-commerce' },
    { id: 'flowers', title: 'Fleuriste', description: 'Gestion de fleuriste avec bouquets et commandes.', icon: Flower, color: 'from-pink-600 to-pink-700', bgColor: 'bg-pink-50', iconColor: 'text-pink-600', features: ['Bouquets', 'Commandes', 'Livraisons'], technologies: ['Next.js'], link: '/flowers', stats: [{ label: 'Bouquets', value: '50+', icon: Flower }], category: 'E-commerce' },
    { id: 'gift', title: 'Boutique Cadeaux', description: 'Gestion de boutique de cadeaux avec produits.', icon: Gift, color: 'from-purple-600 to-purple-700', bgColor: 'bg-purple-50', iconColor: 'text-purple-600', features: ['Cadeaux', 'Packages', 'Ventes'], technologies: ['Next.js'], link: '/gift', stats: [{ label: 'Cadeaux', value: '∞', icon: Gift }], category: 'E-commerce' },
    { id: 'marketplace', title: 'Marketplace', description: 'Plateforme marketplace multi-vendeurs.', icon: Store, color: 'from-green-600 to-green-700', bgColor: 'bg-green-50', iconColor: 'text-green-600', features: ['Vendeurs', 'Produits', 'Transactions'], technologies: ['Next.js'], link: '/marketplace', stats: [{ label: 'Vendeurs', value: '∞', icon: Users }], category: 'E-commerce' },

    // Loisirs & Événements (10)
    { id: 'events', title: 'Gestion Événements', description: 'Gestion d\'événements avec billets et participants.', icon: Calendar, color: 'from-violet-600 to-violet-700', bgColor: 'bg-violet-50', iconColor: 'text-violet-600', features: ['Événements', 'Billets', 'Participants'], technologies: ['Next.js'], link: '/events', stats: [{ label: 'Événements', value: '∞', icon: Calendar }], category: 'Événements' },
    { id: 'cinema', title: 'Gestion Cinéma', description: 'Gestion de cinéma avec séances et réservations.', icon: Film, color: 'from-gray-600 to-gray-700', bgColor: 'bg-gray-50', iconColor: 'text-gray-600', features: ['Films', 'Séances', 'Réservations'], technologies: ['Next.js'], link: '/cinema', stats: [{ label: 'Films', value: '∞', icon: Film }], category: 'Loisirs' },
    { id: 'theater', title: 'Gestion Théâtre', description: 'Gestion de théâtre avec spectacles et billets.', icon: Film, color: 'from-purple-600 to-purple-700', bgColor: 'bg-purple-50', iconColor: 'text-purple-600', features: ['Spectacles', 'Billets', 'Réservations'], technologies: ['Next.js'], link: '/theater', stats: [{ label: 'Spectacles', value: '∞', icon: Calendar }], category: 'Loisirs' },
    { id: 'museum', title: 'Gestion Musée', description: 'Gestion de musée avec expositions et visites.', icon: Building, color: 'from-amber-600 to-amber-700', bgColor: 'bg-amber-50', iconColor: 'text-amber-600', features: ['Expositions', 'Visites', 'Billets'], technologies: ['Next.js'], link: '/museum', stats: [{ label: 'Expositions', value: '∞', icon: Calendar }], category: 'Loisirs' },
    { id: 'park', title: 'Gestion Parc Attractions', description: 'Gestion de parc avec attractions et billets.', icon: Flag, color: 'from-green-600 to-green-700', bgColor: 'bg-green-50', iconColor: 'text-green-600', features: ['Attractions', 'Billets', 'Clients'], technologies: ['Next.js'], link: '/park', stats: [{ label: 'Attractions', value: '20+', icon: Flag }], category: 'Loisirs' },
    { id: 'bowling', title: 'Gestion Bowling', description: 'Gestion de bowling avec pistes et réservations.', icon: Gamepad2, color: 'from-blue-600 to-blue-700', bgColor: 'bg-blue-50', iconColor: 'text-blue-600', features: ['Pistes', 'Réservations', 'Scores'], technologies: ['Next.js'], link: '/bowling', stats: [{ label: 'Pistes', value: '10+', icon: Gamepad2 }], category: 'Loisirs' },
    { id: 'escape', title: 'Gestion Escape Room', description: 'Gestion d\'escape room avec salles et réservations.', icon: Lock, color: 'from-red-600 to-red-700', bgColor: 'bg-red-50', iconColor: 'text-red-600', features: ['Salles', 'Réservations', 'Scores'], technologies: ['Next.js'], link: '/escape', stats: [{ label: 'Salles', value: '5+', icon: Lock }], category: 'Loisirs' },
    { id: 'sports', title: 'Gestion Complexe Sportif', description: 'Gestion de complexe sportif avec terrains et réservations.', icon: Activity, color: 'from-orange-600 to-orange-700', bgColor: 'bg-orange-50', iconColor: 'text-orange-600', features: ['Terrains', 'Réservations', 'Équipements'], technologies: ['Next.js'], link: '/sports', stats: [{ label: 'Terrains', value: '10+', icon: Activity }], category: 'Loisirs' },

    // Transport (5)
    { id: 'transport', title: 'Gestion Transport', description: 'Gestion de transport avec véhicules et trajets.', icon: Truck, color: 'from-orange-600 to-orange-700', bgColor: 'bg-orange-50', iconColor: 'text-orange-600', features: ['Véhicules', 'Trajets', 'Réservations'], technologies: ['Next.js'], link: '/transport', stats: [{ label: 'Véhicules', value: '∞', icon: Truck }], category: 'Transport' },
    { id: 'taxi', title: 'Gestion Taxi', description: 'Gestion de flotte de taxis avec réservations.', icon: CarTaxiFront, color: 'from-yellow-600 to-yellow-700', bgColor: 'bg-yellow-50', iconColor: 'text-yellow-600', features: ['Véhicules', 'Réservations', 'Chauffeurs'], technologies: ['Next.js'], link: '/taxi', stats: [{ label: 'Véhicules', value: '∞', icon: CarTaxiFront }], category: 'Transport' },
    { id: 'delivery', title: 'Gestion Livraison', description: 'Service de livraison avec livreurs et commandes.', icon: Truck, color: 'from-green-600 to-green-700', bgColor: 'bg-green-50', iconColor: 'text-green-600', features: ['Livreurs', 'Commandes', 'Suivi'], technologies: ['Next.js'], link: '/delivery', stats: [{ label: 'Livreurs', value: '∞', icon: Users }], category: 'Transport' },
    { id: 'parking', title: 'Gestion Parking', description: 'Gestion de parking avec places et tarifs.', icon: Car, color: 'from-gray-600 to-gray-700', bgColor: 'bg-gray-50', iconColor: 'text-gray-600', features: ['Places', 'Tarifs', 'Véhicules'], technologies: ['Next.js'], link: '/parking', stats: [{ label: 'Places', value: '∞', icon: Car }], category: 'Transport' },
    { id: 'rental', title: 'Location Véhicules', description: 'Location de véhicules avec réservations.', icon: Car, color: 'from-blue-600 to-blue-700', bgColor: 'bg-blue-50', iconColor: 'text-blue-600', features: ['Véhicules', 'Réservations', 'Clients'], technologies: ['Next.js'], link: '/rental', stats: [{ label: 'Véhicules', value: '∞', icon: Car }], category: 'Transport' },

    // Immobilier (5)
    { id: 'realestate', title: 'Gestion Immobilier', description: 'Gestion immobilière avec propriétés et clients.', icon: Home, color: 'from-slate-600 to-slate-700', bgColor: 'bg-slate-50', iconColor: 'text-slate-600', features: ['Propriétés', 'Clients', 'Visites'], technologies: ['Next.js'], link: '/realestate', stats: [{ label: 'Propriétés', value: '∞', icon: Home }], category: 'Immobilier' },
    { id: 'property', title: 'Gestion Propriétés', description: 'Gestion de propriétés avec locations.', icon: Building, color: 'from-indigo-600 to-indigo-700', bgColor: 'bg-indigo-50', iconColor: 'text-indigo-600', features: ['Propriétés', 'Locations', 'Contrats'], technologies: ['Next.js'], link: '/property', stats: [{ label: 'Propriétés', value: '∞', icon: Building }], category: 'Immobilier' },
    { id: 'construction', title: 'Gestion BTP', description: 'Gestion de projets de construction.', icon: Building2, color: 'from-orange-600 to-orange-700', bgColor: 'bg-orange-50', iconColor: 'text-orange-600', features: ['Projets', 'Chantiers', 'Équipes'], technologies: ['Next.js'], link: '/construction', stats: [{ label: 'Projets', value: '∞', icon: Building2 }], category: 'Immobilier' },
    { id: 'renovation', title: 'Gestion Rénovation', description: 'Gestion de projets de rénovation.', icon: Wrench, color: 'from-amber-600 to-amber-700', bgColor: 'bg-amber-50', iconColor: 'text-amber-600', features: ['Projets', 'Devis', 'Clients'], technologies: ['Next.js'], link: '/renovation', stats: [{ label: 'Projets', value: '∞', icon: Calendar }], category: 'Immobilier' },
    { id: 'facility', title: 'Gestion Installations', description: 'Gestion d\'installations et maintenance.', icon: Settings, color: 'from-cyan-600 to-cyan-700', bgColor: 'bg-cyan-50', iconColor: 'text-cyan-600', features: ['Installations', 'Maintenance', 'Interventions'], technologies: ['Next.js'], link: '/facility', stats: [{ label: 'Installations', value: '∞', icon: Settings }], category: 'Immobilier' },

    // Technologie & Digital (10)
    { id: 'document', title: 'Gestion Documents', description: 'Gestion documentaire avec fichiers et partage.', icon: FileText, color: 'from-sky-600 to-sky-700', bgColor: 'bg-sky-50', iconColor: 'text-sky-600', features: ['Fichiers', 'Versions', 'Partage'], technologies: ['Next.js'], link: '/document', stats: [{ label: 'Documents', value: '∞', icon: FileText }], category: 'Technologie' },
    { id: 'social', title: 'Réseau Social Interne', description: 'Plateforme sociale pour équipes et entreprises.', icon: MessageSquare, color: 'from-indigo-600 to-indigo-700', bgColor: 'bg-indigo-50', iconColor: 'text-indigo-600', features: ['Publications', 'Messages', 'Groupes'], technologies: ['Next.js'], link: '/social', stats: [{ label: 'Utilisateurs', value: '∞', icon: Users }], category: 'Social' },
    { id: 'chat', title: 'Plateforme Chat', description: 'Application de messagerie instantanée.', icon: MessageCircle, color: 'from-green-600 to-green-700', bgColor: 'bg-green-50', iconColor: 'text-green-600', features: ['Messages', 'Groupes', 'Fichiers'], technologies: ['Next.js'], link: '/chat', stats: [{ label: 'Utilisateurs', value: '∞', icon: Users }], category: 'Social' },
    { id: 'forum', title: 'Plateforme Forum', description: 'Forum de discussion avec topics et réponses.', icon: MessageSquare, color: 'from-blue-600 to-blue-700', bgColor: 'bg-blue-50', iconColor: 'text-blue-600', features: ['Topics', 'Réponses', 'Utilisateurs'], technologies: ['Next.js'], link: '/forum', stats: [{ label: 'Topics', value: '∞', icon: MessageSquare }], category: 'Social' },
    { id: 'blog', title: 'Plateforme Blog', description: 'Plateforme de blog avec articles et commentaires.', icon: Newspaper, color: 'from-purple-600 to-purple-700', bgColor: 'bg-purple-50', iconColor: 'text-purple-600', features: ['Articles', 'Commentaires', 'Auteurs'], technologies: ['Next.js'], link: '/blog', stats: [{ label: 'Articles', value: '∞', icon: Newspaper }], category: 'Technologie' },
    { id: 'cms', title: 'Système CMS', description: 'Système de gestion de contenu complet.', icon: FileText, color: 'from-gray-600 to-gray-700', bgColor: 'bg-gray-50', iconColor: 'text-gray-600', features: ['Contenu', 'Pages', 'Médias'], technologies: ['Next.js'], link: '/cms', stats: [{ label: 'Pages', value: '∞', icon: FileText }], category: 'Technologie' },
    { id: 'api', title: 'Gestion API', description: 'Plateforme de gestion et documentation d\'API.', icon: Code, color: 'from-teal-600 to-teal-700', bgColor: 'bg-teal-50', iconColor: 'text-teal-600', features: ['APIs', 'Documentation', 'Tests'], technologies: ['Next.js'], link: '/api', stats: [{ label: 'APIs', value: '∞', icon: Code }], category: 'Technologie' },
    { id: 'cloud', title: 'Gestion Cloud', description: 'Gestion de stockage cloud avec fichiers.', icon: Cloud, color: 'from-blue-600 to-blue-700', bgColor: 'bg-blue-50', iconColor: 'text-blue-600', features: ['Stockage', 'Fichiers', 'Partage'], technologies: ['Next.js'], link: '/cloud', stats: [{ label: 'Fichiers', value: '∞', icon: Cloud }], category: 'Technologie' },
    { id: 'monitoring', title: 'Monitoring Système', description: 'Monitoring de systèmes et applications.', icon: Activity, color: 'from-red-600 to-red-700', bgColor: 'bg-red-50', iconColor: 'text-red-600', features: ['Métriques', 'Alertes', 'Rapports'], technologies: ['Next.js'], link: '/monitoring', stats: [{ label: 'Systèmes', value: '∞', icon: Activity }], category: 'Technologie' },
    { id: 'analytics', title: 'Plateforme Analytics', description: 'Plateforme d\'analyse de données.', icon: BarChart3, color: 'from-indigo-600 to-indigo-700', bgColor: 'bg-indigo-50', iconColor: 'text-indigo-600', features: ['Données', 'Graphiques', 'Rapports'], technologies: ['Next.js'], link: '/analytics', stats: [{ label: 'Datasets', value: '∞', icon: Database }], category: 'Technologie' },

    // Famille & Personnal (5)
    { id: 'moms', title: 'Gestion Mamans', description: 'Support complet pour mamans avec rendez-vous.', icon: Heart, color: 'from-red-600 to-red-700', bgColor: 'bg-red-50', iconColor: 'text-red-600', features: ['Mamans', 'RDV', 'Ressources'], technologies: ['Next.js'], link: '/moms', stats: [{ label: 'Mamans', value: '∞', icon: Heart }], category: 'Famille' },
    { id: 'family', title: 'Gestion Famille', description: 'Organisation familiale avec calendrier et tâches.', icon: Users, color: 'from-pink-600 to-pink-700', bgColor: 'bg-pink-50', iconColor: 'text-pink-600', features: ['Membres', 'Calendrier', 'Tâches'], technologies: ['Next.js'], link: '/family', stats: [{ label: 'Membres', value: '∞', icon: Users }], category: 'Famille' },
    { id: 'baby', title: 'Suivi Bébé', description: 'Suivi de bébé avec repas, sommeil et santé.', icon: Baby, color: 'from-blue-600 to-blue-700', bgColor: 'bg-blue-50', iconColor: 'text-blue-600', features: ['Repas', 'Sommeil', 'Santé'], technologies: ['Next.js'], link: '/baby', stats: [{ label: 'Événements', value: '∞', icon: Calendar }], category: 'Famille' },
    { id: 'pets', title: 'Gestion Animaux', description: 'Gestion des animaux de compagnie avec santé.', icon: Heart, color: 'from-orange-600 to-orange-700', bgColor: 'bg-orange-50', iconColor: 'text-orange-600', features: ['Animaux', 'Santé', 'Vaccins'], technologies: ['Next.js'], link: '/pets', stats: [{ label: 'Animaux', value: '∞', icon: Heart }], category: 'Famille' },
    { id: 'elderly', title: 'Gestion Personnes Âgées', description: 'Suivi des personnes âgées avec soins.', icon: Heart, color: 'from-purple-600 to-purple-700', bgColor: 'bg-purple-50', iconColor: 'text-purple-600', features: ['Personnes', 'Soins', 'Médicaments'], technologies: ['Next.js'], link: '/elderly', stats: [{ label: 'Personnes', value: '∞', icon: Users }], category: 'Famille' },

    // Automobile (5)
    { id: 'carwash', title: 'Gestion Lavage Auto', description: 'Gestion de station de lavage avec services.', icon: Car, color: 'from-cyan-600 to-cyan-700', bgColor: 'bg-cyan-50', iconColor: 'text-cyan-600', features: ['Services', 'Véhicules', 'Abonnements'], technologies: ['Next.js'], link: '/carwash', stats: [{ label: 'Services', value: '5+', icon: Car }], category: 'Automobile' },
    { id: 'tires', title: 'Gestion Pneus', description: 'Gestion de centre de pneus avec stock.', icon: Car, color: 'from-gray-600 to-gray-700', bgColor: 'bg-gray-50', iconColor: 'text-gray-600', features: ['Pneus', 'Stock', 'Services'], technologies: ['Next.js'], link: '/tires', stats: [{ label: 'Pneus', value: '∞', icon: Package }], category: 'Automobile' },
    { id: 'carparts', title: 'Gestion Pièces Auto', description: 'Gestion de magasin de pièces détachées.', icon: Car, color: 'from-blue-600 to-blue-700', bgColor: 'bg-blue-50', iconColor: 'text-blue-600', features: ['Pièces', 'Stock', 'Ventes'], technologies: ['Next.js'], link: '/carparts', stats: [{ label: 'Pièces', value: '∞', icon: Package }], category: 'Automobile' },
    { id: 'autodealer', title: 'Concessionnaire Auto', description: 'Gestion de concessionnaire avec véhicules.', icon: Car, color: 'from-red-600 to-red-700', bgColor: 'bg-red-50', iconColor: 'text-red-600', features: ['Véhicules', 'Clients', 'Ventes'], technologies: ['Next.js'], link: '/autodealer', stats: [{ label: 'Véhicules', value: '∞', icon: Car }], category: 'Automobile' },
    { id: 'garage', title: 'Gestion Garage', description: 'Gestion complète de garage avec services.', icon: Car, color: 'from-green-600 to-green-700', bgColor: 'bg-green-50', iconColor: 'text-green-600', features: ['Services', 'Véhicules', 'Stock'], technologies: ['Next.js'], link: '/garage', stats: [{ label: 'Services', value: '∞', icon: Settings }], category: 'Automobile' },
  ]

  const filteredApps = selectedCategory === 'Toutes' 
    ? applications 
    : applications.filter(app => app.category === selectedCategory)

  return (
    <section ref={ref} className="section-padding bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-gradient">Applications Web</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto mb-6">
            Collection complète de <span className="font-bold text-gray-900">{applications.length} applications</span> web interactives et fonctionnelles
          </p>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                  selectedCategory === category
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg scale-105'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {category}
                {category !== 'Toutes' && (
                  <span className="ml-2 text-xs opacity-75">
                    ({applications.filter(app => app.category === category).length})
                  </span>
                )}
              </button>
            ))}
          </div>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredApps.map((app, index) => {
            const Icon = app.icon
            return (
              <motion.div
                key={app.id}
                initial={{ opacity: 0, y: 50 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                transition={{ duration: 0.4, delay: index * 0.02 }}
                className="group"
              >
                <Link href={app.link}>
                  <div className="bg-white rounded-xl shadow-lg border border-gray-200 hover:shadow-2xl transition-all duration-300 overflow-hidden h-full flex flex-col">
                    {/* Header */}
                    <div className={`${app.bgColor} p-5 relative overflow-hidden`}>
                      <div className="absolute inset-0 opacity-10">
                        <div className="absolute inset-0 bg-gradient-to-br from-white to-transparent"></div>
                      </div>
                      <div className="relative z-10">
                        <div className="inline-flex p-3 rounded-xl bg-white shadow-md mb-3">
                          <Icon className={`w-6 h-6 ${app.iconColor}`} />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-1">{app.title}</h3>
                        <p className="text-sm text-gray-600 line-clamp-2">{app.description}</p>
                        <span className="inline-block mt-2 px-2 py-0.5 bg-white/80 rounded text-xs text-gray-700 font-medium">
                          {app.category}
                        </span>
                      </div>
                    </div>

                    {/* Features */}
                    <div className="p-4 flex-1">
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {app.features.slice(0, 3).map((feature, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-xs"
                          >
                            {feature}
                          </span>
                        ))}
                        {app.features.length > 3 && (
                          <span className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-xs">
                            +{app.features.length - 3}
                          </span>
                        )}
                      </div>

                      {/* Stats */}
                      <div className="grid grid-cols-2 gap-2 mb-3 pt-3 border-t border-gray-200">
                        {app.stats.map((stat, i) => {
                          const StatIcon = stat.icon
                          return (
                            <div key={i} className="text-center">
                              <StatIcon className={`w-4 h-4 ${app.iconColor} mx-auto mb-1`} />
                              <div className="text-sm font-bold text-gray-900">{stat.value}</div>
                              <div className="text-xs text-gray-500">{stat.label}</div>
                            </div>
                          )
                        })}
                      </div>

                      {/* Technologies */}
                      <div className="flex flex-wrap gap-1">
                        {app.technologies.map((tech, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-xs font-medium"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="p-4 bg-gray-50 border-t border-gray-200">
                      <div
                        className={`flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r ${app.color} text-white rounded-lg hover:shadow-lg transition-all group/button text-sm font-medium`}
                      >
                        <span>Accéder</span>
                        <ArrowRight className="w-4 h-4 group-hover/button:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </div>

        {filteredApps.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">Aucune application dans cette catégorie</p>
          </div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-12 text-center"
        >
          <p className="text-gray-600">
            <span className="font-semibold text-gray-900">{applications.length} applications</span> entièrement fonctionnelles avec stockage local
          </p>
        </motion.div>
      </div>
    </section>
  )
}
