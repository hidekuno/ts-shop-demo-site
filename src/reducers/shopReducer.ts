/*
 * cd shop demo program
 *
 * hidekuno@gmail.com
 *
 */
import {ADD_ORDER, SIGNIN_USERNAME, ADD_VIEWED} from '../constants';
import {OrderItem,OrderEntry,ViewedItem,MusicItem} from '../store';

export interface ShopState {
  username: string;
  order: OrderItem[];
  views: ViewedItem[];
}

export type ShopAction =
  | {type: 'SIGNIN_USERNAME'; payload: {username: string}}
  | {type: 'ADD_ORDER'; payload: {order: OrderEntry}}
  | {type: 'ADD_VIEWED'; payload: MusicItem};

const getNow = () => {
  const d = new Date();
  return d.toLocaleDateString('sv-SE') + ' ' + d.toLocaleTimeString('sv-SE');
};

const makeOrder = (order: OrderEntry): OrderItem => {

  // I am currently considering using crypto.randomUUID().
  // So the following code may become obsolete.
  const random = (min: number, max: number, digit: number): string =>
    (Math.floor(Math.random() * (max + min))).toString().padStart(digit, '0');

  const orderno: string = random(1, 1000, 3) + '-' + random(1, 10000000, 7) + '-' + random(1, 10000000, 7);
  return {orderno, orderDatetime:getNow(), total: order.total, payment: order.payment, detail: order.detail};
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
    // It's dead code
    // default:
    //  throw new Error('No such action type');
  }
};
