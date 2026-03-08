/*
 * cd shop demo program
 *
 * hidekuno@gmail.com
 *
 */
import {ADD_ORDER, SIGNIN_USERNAME, ADD_VIEWED} from '../constants';
import {OrderItem, OrderEntry, ViewedItem, MusicItem} from '../types';
import {getNow, generateUUID} from '../utils';

export interface ShopState {
  username: string;
  order: OrderItem[];
  views: ViewedItem[];
}

export type ShopAction =
  | {type: 'SIGNIN_USERNAME'; payload: {username: string}}
  | {type: 'ADD_ORDER'; payload: {order: OrderEntry}}
  | {type: 'ADD_VIEWED'; payload: MusicItem};

const makeOrder = (order: OrderEntry): OrderItem => {
  return {orderno: generateUUID(), orderDatetime: getNow(), total: order.total, payment: order.payment, detail: order.detail};
};

export const shopReducer = (state: ShopState, action: ShopAction): ShopState => {
  switch (action.type) {
    case SIGNIN_USERNAME:
      return {...state, username: action.payload.username};

    case ADD_ORDER:
      return {
        ...state,
        order: [
          makeOrder(action.payload.order),
          ...state.order,
        ]
      };
    case ADD_VIEWED:
      return {
        ...state,
        views: [
          {datetime: getNow(), item: action.payload},
          ...state.views,
        ]
      };
    default:
      return state;
  }
};
