export interface Order {
  id: string;
  user_id: string;
  customer_name: string | null;
  phone: string | null;
  address: string | null;
  lat: number | null;
  lng: number | null;
  clothes_weight: number | null;
  blankets_count: number | null;
  total_price: number | null;
  status: OrderStatus;
  created_at: string;
}

export type OrderStatus =
  | 'Pending'
  | 'Preparing'
  | 'Ready'
  | 'Out for Delivery'
  | 'Delivered'
  | 'Cancelled'
  | 'Picked Up'
  | 'Washing'
  | 'Drying';
