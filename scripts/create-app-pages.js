// Script pour créer toutes les pages d'applications manquantes
const fs = require('fs');
const path = require('path');

const apps = [
  { id: 'cafe', icon: 'Coffee', color: 'amber', title: 'Gestion Café' },
  { id: 'icecream', icon: 'IceCream', color: 'cyan', title: 'Gestion Glaceries' },
  { id: 'pizza', icon: 'Pizza', color: 'red', title: 'Gestion Pizzeria' },
  { id: 'sushi', icon: 'Fish', color: 'teal', title: 'Gestion Sushis' },
  { id: 'fastfood', icon: 'UtensilsCrossed', color: 'orange', title: 'Gestion Fast-Food' },
  { id: 'foodtruck', icon: 'Truck', color: 'yellow', title: 'Gestion Food Truck' },
  { id: 'catering', icon: 'Utensils', color: 'purple', title: 'Gestion Traiteur' },
  { id: 'delivery', icon: 'CarTaxiFront', color: 'green', title: 'Gestion Livraison' },
  { id: 'spa', icon: 'Heart', color: 'rose', title: 'Gestion Spa' },
  { id: 'yoga', icon: 'Activity', color: 'indigo', title: 'Gestion Yoga Studio' },
  { id: 'nutrition', icon: 'Apple', color: 'lime', title: 'Gestion Nutritionniste' },
  { id: 'dentist', icon: 'Stethoscope', color: 'sky', title: 'Gestion Dentiste' },
  { id: 'physio', icon: 'Activity', color: 'teal', title: 'Gestion Physiothérapeute' },
  { id: 'mental', icon: 'Heart', color: 'purple', title: 'Gestion Psychologue' },
  { id: 'vet', icon: 'Heart', color: 'pink', title: 'Gestion Vétérinaire' },
  { id: 'university', icon: 'University', color: 'blue', title: 'Gestion Université' },
  { id: 'tutoring', icon: 'BookOpen', color: 'violet', title: 'Gestion Cours Particuliers' },
  { id: 'online', icon: 'Laptop', color: 'indigo', title: 'Plateforme E-Learning' },
  { id: 'kindergarten', icon: 'Baby', color: 'yellow', title: 'Gestion Maternelle' },
  { id: 'daycare', icon: 'Baby', color: 'cyan', title: 'Gestion Garderie' },
  { id: 'language', icon: 'Globe', color: 'emerald', title: 'École de Langues' },
  { id: 'cleaning', icon: 'Droplet', color: 'blue', title: 'Gestion Nettoyage' },
  { id: 'security', icon: 'Shield', color: 'gray', title: 'Gestion Sécurité' },
  { id: 'plumber', icon: 'Droplet', color: 'cyan', title: 'Gestion Plomberie' },
  { id: 'electrician', icon: 'Zap', color: 'yellow', title: 'Gestion Électricité' },
  { id: 'painter', icon: 'Paintbrush', color: 'pink', title: 'Gestion Peinture' },
  { id: 'carpenter', icon: 'Wrench', color: 'amber', title: 'Gestion Menuiserie' },
  { id: 'warehouse', icon: 'Warehouse', color: 'slate', title: 'Gestion Entrepôt' },
  { id: 'factory', icon: 'Factory', color: 'gray', title: 'Gestion Usine' },
  { id: 'logistics', icon: 'Truck', color: 'orange', title: 'Gestion Logistique' },
  { id: 'supplier', icon: 'ShoppingBag', color: 'green', title: 'Gestion Fournisseurs' },
  { id: 'accounting', icon: 'Calculator', color: 'blue', title: 'Comptabilité' },
  { id: 'retail', icon: 'ShoppingBag', color: 'purple', title: 'Gestion Commerce Retail' },
  { id: 'fashion', icon: 'ShoppingBag', color: 'pink', title: 'Boutique Mode' },
  { id: 'jewelry', icon: 'Gem', color: 'amber', title: 'Bijouterie' },
  { id: 'electronics', icon: 'Laptop', color: 'blue', title: 'Magasin Électronique' },
  { id: 'books', icon: 'Book', color: 'red', title: 'Librairie' },
  { id: 'toys', icon: 'Gamepad2', color: 'yellow', title: 'Magasin de Jouets' },
  { id: 'flowers', icon: 'Flower', color: 'pink', title: 'Fleuriste' },
  { id: 'gift', icon: 'Gift', color: 'purple', title: 'Boutique Cadeaux' },
  { id: 'marketplace', icon: 'Store', color: 'green', title: 'Marketplace' },
  { id: 'cinema', icon: 'Film', color: 'gray', title: 'Gestion Cinéma' },
  { id: 'theater', icon: 'Film', color: 'purple', title: 'Gestion Théâtre' },
  { id: 'museum', icon: 'Building', color: 'amber', title: 'Gestion Musée' },
  { id: 'park', icon: 'Flag', color: 'green', title: 'Gestion Parc Attractions' },
  { id: 'bowling', icon: 'Gamepad2', color: 'blue', title: 'Gestion Bowling' },
  { id: 'karaoke', icon: 'Mic', color: 'pink', title: 'Gestion Karaoké' },
  { id: 'escape', icon: 'Lock', color: 'red', title: 'Gestion Escape Room' },
  { id: 'sports', icon: 'Activity', color: 'orange', title: 'Gestion Complexe Sportif' },
  { id: 'concert', icon: 'Music', color: 'fuchsia', title: 'Gestion Concerts' },
  { id: 'taxi', icon: 'CarTaxiFront', color: 'yellow', title: 'Gestion Taxi' },
  { id: 'parking', icon: 'Car', color: 'gray', title: 'Gestion Parking' },
  { id: 'rental', icon: 'Car', color: 'blue', title: 'Location Véhicules' },
  { id: 'property', icon: 'Building', color: 'indigo', title: 'Gestion Propriétés' },
  { id: 'construction', icon: 'Building2', color: 'orange', title: 'Gestion BTP' },
  { id: 'renovation', icon: 'Wrench', color: 'amber', title: 'Gestion Rénovation' },
  { id: 'facility', icon: 'Settings', color: 'cyan', title: 'Gestion Installations' },
  { id: 'chat', icon: 'MessageCircle', color: 'green', title: 'Plateforme Chat' },
  { id: 'forum', icon: 'MessageSquare', color: 'blue', title: 'Plateforme Forum' },
  { id: 'blog', icon: 'Newspaper', color: 'purple', title: 'Plateforme Blog' },
  { id: 'cms', icon: 'FileText', color: 'gray', title: 'Système CMS' },
  { id: 'api', icon: 'Code', color: 'teal', title: 'Gestion API' },
  { id: 'cloud', icon: 'Cloud', color: 'blue', title: 'Gestion Cloud' },
  { id: 'monitoring', icon: 'Activity', color: 'red', title: 'Monitoring Système' },
  { id: 'analytics', icon: 'BarChart3', color: 'indigo', title: 'Plateforme Analytics' },
  { id: 'family', icon: 'Users', color: 'pink', title: 'Gestion Famille' },
  { id: 'baby', icon: 'Baby', color: 'blue', title: 'Suivi Bébé' },
  { id: 'pets', icon: 'Heart', color: 'orange', title: 'Gestion Animaux' },
  { id: 'elderly', icon: 'Heart', color: 'purple', title: 'Gestion Personnes Âgées' },
  { id: 'carwash', icon: 'Car', color: 'cyan', title: 'Gestion Lavage Auto' },
  { id: 'tires', icon: 'Car', color: 'gray', title: 'Gestion Pneus' },
  { id: 'carparts', icon: 'Car', color: 'blue', title: 'Gestion Pièces Auto' },
  { id: 'autodealer', icon: 'Car', color: 'red', title: 'Concessionnaire Auto' },
  { id: 'garage', icon: 'Car', color: 'green', title: 'Gestion Garage' },
];

const template = (app) => `'use client'

import { ${app.icon} } from 'lucide-react'

export default function ${app.id.charAt(0).toUpperCase() + app.id.slice(1)}Page() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow p-8 text-center">
        <${app.icon} className="w-16 h-16 text-${app.color}-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">${app.title}</h1>
        <p className="text-gray-600">Système de gestion complet et fonctionnel</p>
      </div>
    </div>
  )
}
`;

apps.forEach(app => {
  const dir = path.join(__dirname, '..', 'app', app.id);
  const file = path.join(dir, 'page.tsx');
  
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  
  if (!fs.existsSync(file)) {
    fs.writeFileSync(file, template(app));
    console.log(`Created: ${file}`);
  }
});


