/*
 * cd shop demo program
 *
 * hidekuno@gmail.com
 *
 */
export interface MusicItem {
  id: number;
  title: string;
  artist: string;
  imageUrl: string;
  description: string;
  price: number;
}

export interface CartItem {
  item: MusicItem,
  qty: number;
  totalPrice: number;
}

export interface OrderItem {
  item: MusicItem;
  qty: number;
}

export interface Order {
  orderno: string;
  orderDatetime: string;
  payment: number;
  total: number;
  detail: OrderItem[];
}

export interface OrderEntry {
  total: number;
  payment: number;
  detail: CartItem[];
}
