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
}

export interface Order {
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
