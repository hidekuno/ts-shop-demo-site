/*
 * cd shop demo program
 *
 * hidekuno@gmail.com
 *
 */
import { MusicItem } from '../data';
import { ADD_ITEM, DEL_ITEM, CLEAR_ITEMS, ADD_POINT, DEL_POINT } from '../constants';

export interface CartItem  {
  id: number;
  title: string;
  artist: string;
  price: number;
  imageUrl: string;
  qty: number;
  totalPrice: number;
};

export interface CartState {
  cart: CartItem[];
  point: number;
};

export type CartAction =
    { type: 'ADD_ITEM'; payload: MusicItem }
  | { type: 'DEL_ITEM'; payload: CartItem }
  | { type: 'CLEAR_ITEMS' }
  | { type: 'ADD_POINT'; payload: {point: number} }
  | { type: 'DEL_POINT'; payload: {point: number} };

const getItem = (cart: CartItem[], id: number): CartItem | undefined =>
  cart.find((item) => item.id === id);

const deleteItem = (cart: CartItem[], id: number): CartItem[] =>
  cart.filter((item) => item.id !== id);

const existsItem = (cart: CartItem[], id: number): boolean =>
  cart.some((item) => item.id === id);

export const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case ADD_ITEM:
      return {
        ...state,
        cart: (() => {
          if (existsItem(state.cart, action.payload.id)) {
            const item = getItem(state.cart, action.payload.id)!;
            return [
              {
                ...item,
                qty: item.qty + 1,
                totalPrice: item.price * (item.qty + 1),
              },
              ...deleteItem(state.cart, action.payload.id),
            ];
          } else {
            const { id, title, artist, price, imageUrl } = action.payload;
            return [
              {
                id,
                title,
                price,
                artist,
                imageUrl,
                qty: 1,
                totalPrice: price,
              },
              ...state.cart,
            ];
          }
        })(),
      };
    case DEL_ITEM: {
      const item = getItem(state.cart, action.payload.id)!;
      const qty = item.qty - 1;
      return {
        ...state,
        cart: (() => {
          if (qty === 0) {
            return deleteItem(state.cart, action.payload.id);
          } else {
            return [
              {
                ...item,
                qty: qty,
                totalPrice: item.price * qty,
              },
              ...deleteItem(state.cart, action.payload.id),
            ];
          }
        })(),
      };
    }
    case CLEAR_ITEMS:
      return { ...state, cart: [] };

    case ADD_POINT:
      return { ...state, point: state.point + action.payload.point };

    case DEL_POINT: {
      const point = state.point - action.payload.point;
      return { ...state, point: Math.max(0, point) };
    }
    default:
      throw new Error('No such action type');
  }
};
