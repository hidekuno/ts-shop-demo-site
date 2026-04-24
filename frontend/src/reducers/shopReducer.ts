/*
 * cd shop demo program
 *
 * hidekuno@gmail.com
 *
 */
import {SET_USER, SET_ORDERS, SET_VIEWS, ADD_ORDER, ADD_VIEWED} from '../constants';
import {OrderItem, ViewedItem} from '../types';

export interface ShopState {
  username: string;
  point: number;
  order: OrderItem[];
  views: ViewedItem[];
}

export type ShopAction =
  | {type: 'SET_USER'; payload: {username: string, point: number}}
  | {type: 'SET_ORDERS'; payload: OrderItem[]}
  | {type: 'SET_VIEWS'; payload: ViewedItem[]}
  | {type: 'ADD_ORDER'; payload: OrderItem}
  | {type: 'ADD_VIEWED'; payload: ViewedItem};

export const shopReducer = (state: ShopState, action: ShopAction): ShopState => {
  switch (action.type) {
    case SET_USER:
      return {...state, username: action.payload.username, point: action.payload.point};
    case SET_ORDERS:
      return {...state, order: action.payload};
    case SET_VIEWS:
      return {...state, views: action.payload};
    case ADD_ORDER:
      return {
        ...state,
        order: [
          action.payload,
          ...state.order,
        ]
      };
    case ADD_VIEWED:
      return {
        ...state,
        views: [
          action.payload,
          ...state.views,
        ]
      };
    default:
      return state;
  }
};
