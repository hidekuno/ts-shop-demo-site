/*
 * cd shop demo program
 *
 * hidekuno@gmail.com
 *
 */
import {ADD_ORDER, SIGNIN_USERNAME} from '../constants';
import {Order,OrderEntry} from '../store';

export interface ShopState {
  username: string;
  order: Order[];
}

export type ShopAction =
  | {type: 'SIGNIN_USERNAME'; payload: {username: string}}
  | {type: 'ADD_ORDER'; payload: {order: OrderEntry}};

const makeOrder = (order: OrderEntry): Order => {
  const random = (min: number, max: number, digit: number): string =>
    (Math.floor(Math.random() * (max + min))).toString().padStart(digit, '0');

  const d = new Date();
  const orderDatetime: string = d.toLocaleDateString('sv-SE') + ' ' + d.toLocaleTimeString('sv-SE');
  const orderno: string = random(1, 1000, 3) + '-' + random(1, 10000000, 7) + '-' + random(1, 10000000, 7);
  return {orderno, orderDatetime, total: order.total, payment: order.payment, detail: order.detail};
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
    // It's dead code
    // default:
    //  throw new Error('No such action type');
  }
};
