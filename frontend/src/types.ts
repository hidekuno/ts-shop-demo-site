export interface MusicItem {
  id: number;
  title: string;
  artist: string;
  imageUrl: string;
  description: string;
  price: number;
  stock: number;
  digital: boolean;
}

export interface CartItem {
  item: MusicItem;
  qty: number;
}

export interface OrderItem {
  orderno: string;
  orderDatetime: string;
  total: number;
  payment: number;
  detail: CartItem[];
}

export interface OrderEntry {
  total: number;
  payment: number;
  detail: CartItem[];
}

export interface ViewedItem {
  datetime: string;
  item: MusicItem;
}

export interface MusicItemResponse {
  id: number;
  title: string;
  artist: string;
  image_url: string;
  description: string;
  price: number;
  stock: number;
  digital: boolean;
}

export interface CartItemResponse {
  item: MusicItemResponse;
  qty: number;
}

export interface OrderItemResponse {
  order_no: string;
  order_datetime: string;
  total: number;
  payment: number;
  detail: CartItemResponse[];
}

export interface ViewedItemResponse {
  viewed_datetime: string;
  item: MusicItemResponse;
}
