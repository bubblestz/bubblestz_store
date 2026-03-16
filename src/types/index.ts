export interface Order {
  id: number;
  app_id: string;
  user_id: string;
  customer_name: string;
  phone: string;
  address: string;
  location_lat: number;
  location_lng: number;
  total_cost: number;
  status: OrderStatus;
  created_at: string;
}

export type OrderStatus =
  | 'Pending'
  | 'Picked Up'
  | 'Washing'
  | 'Drying'
  | 'Ready for Delivery'
  | 'Delivered'
  | 'Cancelled';
