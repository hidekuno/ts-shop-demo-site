/*
 * cd shop demo program
 *
 * hidekuno@gmail.com
 *
 */
import {MusicItem,CartItem} from '../store';
import {ADD_ITEM, DEL_ITEM, CLEAR_ITEMS} from '../constants';

export interface CartState {
  cart: CartItem[];
}

export type CartAction =
  | {type: 'ADD_ITEM'; payload: MusicItem}
  | {type: 'DEL_ITEM'; payload: CartItem}
  | {type: 'CLEAR_ITEMS'};

const getItem = (cart: CartItem[], id: number): CartItem | undefined =>
  cart.find((c) => c.item.id === id);

const deleteItem = (cart: CartItem[], id: number): CartItem[] =>
  cart.filter((c) => c.item.id !== id);

export const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case ADD_ITEM: {
      const existingItem = getItem(state.cart, action.payload.id);

      if (existingItem) {
        return {
          ...state,
          cart: state.cart.map(c =>
            c.item.id === action.payload.id ? {...c, qty: c.qty + 1} : c
          ),
        };
      }

      return {...state, cart: [{item: action.payload, qty: 1}, ...state.cart]};
    }
    case DEL_ITEM: {
      const existingItem = getItem(state.cart, action.payload.item.id);

      if (!existingItem) return state;

      if (existingItem.qty === 1) {
        return {...state, cart: deleteItem(state.cart, action.payload.item.id)};
      }

      return {
        ...state,
        cart: state.cart.map(c =>
          c.item.id === action.payload.item.id ? {...c, qty: c.qty - 1} : c
        ),
      };
    }
    case CLEAR_ITEMS:
      return {...state, cart: []};

    default:
      return state;
  }
};
