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

const existsItem = (cart: CartItem[], id: number): boolean =>
  cart.some((c) => c.item.id === id);

export const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case ADD_ITEM:
      return {
        ...state,
        cart: (() => {
          if (existsItem(state.cart, action.payload.id)) {
            const c = getItem(state.cart, action.payload.id)!;
            return [
              {
                item: c.item,
                qty: c.qty + 1,
              },
              ...deleteItem(state.cart, action.payload.id),
            ];
          } else {
            return [
              {
                item: action.payload,
                qty: 1,
              },
              ...state.cart,
            ];
          }
        })(),
      };
    case DEL_ITEM: {
      const c = getItem(state.cart, action.payload.item.id)!;
      const qty = c.qty - 1;
      return {
        ...state,
        cart: (() => {
          if (qty === 0) {
            return deleteItem(state.cart, action.payload.item.id);
          } else {
            return [
              {
                item: c.item,
                qty: qty,
              },
              ...deleteItem(state.cart, action.payload.item.id),
            ];
          }
        })(),
      };
    }
    case CLEAR_ITEMS:
      return {...state, cart: []};

    case ADD_POINT:
      return {...state, point: state.point + action.payload.point};

    case DEL_POINT: {
      const point = state.point - action.payload.point;
      return {...state, point: Math.max(0, point)};
    }
    // It's dead code
    // default:
    //  throw new Error('No such action type');
  }
};
