/*
 * cd shop demo program
 *
 * hidekuno@gmail.com
 *
 */
import {MusicItem,CartItem} from '../store';
import {ADD_ITEM, DEL_ITEM, CLEAR_ITEMS, ADD_POINT, DEL_POINT} from '../constants';

export interface CartState {
  cart: CartItem[];
  point: number;
}

export type CartAction =
  | {type: 'ADD_ITEM'; payload: MusicItem}
  | {type: 'DEL_ITEM'; payload: CartItem}
  | {type: 'CLEAR_ITEMS'}
  | {type: 'ADD_POINT'; payload: {point: number}}
  | {type: 'DEL_POINT'; payload: {point: number}};

const getItem = (cart: CartItem[], id: number): CartItem | undefined =>
  cart.find((c) => c.item.id === id);

const deleteItem = (cart: CartItem[], id: number): CartItem[] =>
  cart.filter((c) => c.item.id !== id);

export const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case ADD_ITEM: {
      const updatedCart = [...state.cart];
      const existingItem = getItem(updatedCart, action.payload.id);

      if (existingItem) {
        existingItem.qty += 1;
      } else {
        updatedCart.unshift({item: action.payload, qty: 1});
      }

      return {...state, cart: updatedCart};
    }
    case DEL_ITEM: {
      const updatedCart = [...state.cart];
      const existingItem = getItem(updatedCart, action.payload.item.id);

      if (existingItem) {
        existingItem.qty -= 1;
        if (existingItem.qty === 0) {
          return {...state, cart: deleteItem(updatedCart, action.payload.item.id)};
        }
      }

      return {...state, cart: updatedCart};
    }
    case CLEAR_ITEMS:
      return {...state, cart: []};

    case ADD_POINT:
      return {...state, point: state.point + action.payload.point};

    case DEL_POINT: {
      const point = state.point - action.payload.point;
      return {...state, point: Math.max(0, point)};
    }
    default:
      return state;
  }
};
