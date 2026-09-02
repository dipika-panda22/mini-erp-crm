export type Role =
  | 'ADMIN'
  | 'SALES'
  | 'WAREHOUSE'
  | 'ACCOUNTS';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
}

export interface Customer {
  id: string;
  name: string;
  mobile: string;
  email?: string | null;
  business_name?: string | null;
  gst_number?: string | null;
  customer_type: 'RETAIL' | 'WHOLESALE' | 'DISTRIBUTOR';
  address: string;
  status: 'LEAD' | 'ACTIVE' | 'INACTIVE';
  follow_up_date?: string | null;
  notes?: string | null;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  unit_price: number | string;
  current_stock: number;
  minimum_stock: number;
  warehouse_location: string;
  low_stock?: boolean;
  created_at: string;
  updated_at: string;
}

export interface StockMovement {
  id: string;
  product_id: string;
  quantity: number;
  movement_type: 'IN' | 'OUT';
  reason: string;
  created_by: string;
  created_by_name?: string;
  created_at: string;
}

export interface ChallanItem {
  id?: string;
  product_id: string;
  product_name_snapshot?: string;
  sku_snapshot?: string;
  unit_price_snapshot?: number | string;
  quantity: number;
}

export interface Challan {
  id: string;
  challan_number: string;
  customer_id: string;
  customer_name?: string;
  total_quantity: number;
  status: 'DRAFT' | 'CONFIRMED' | 'CANCELLED';
  created_by: string;
  created_by_name?: string;
  created_at: string;
  updated_at: string;
  items?: ChallanItem[];
}