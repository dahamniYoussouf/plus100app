export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image?: string;
  available: boolean;
}

export interface OrderItem {
  id: string;
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
  notes?: string;
}

export interface Order {
  id: string;
  tableId: string;
  items: OrderItem[];
  status: 'pending' | 'preparing' | 'ready' | 'served' | 'completed' | 'cancelled';
  total: number;
  createdAt: Date;
  completedAt?: Date;
  paymentMethod?: 'cash' | 'card' | 'digital';
  paymentStatus: 'unpaid' | 'paid';
}

export interface Table {
  id: string;
  number: number;
  capacity: number;
  status: 'available' | 'occupied' | 'reserved';
  currentOrderId?: string;
}

export interface Category {
  id: string;
  name: string;
  icon?: string;
}




