/*
 * cd shop demo program
 *
 * hidekuno@gmail.com
 *
 */
import {ADD_ORDER, SIGNIN_USERNAME } from '../constants';

interface OrderDetailItem {
  title: string;
  price: number;
  qty: number;
};

export interface Order {
  total: number;
  payment: number;
  detail: OrderDetailItem[];
};

export interface ShopState {
  username: string;
  order: {
    orderno: string;
    orderDatetime: string;
    total: number;
    payment: number;
    detail: OrderDetailItem[];
  }[];
};

export type ShopAction =
  |{type: 'SIGNIN_USERNAME'; payload: {username: string}}
  |{type: 'ADD_ORDER'; payload: {order: Order}};

const makeOrder = (order: Order): ShopState['order'][0] => {
  const random = (min: number, max: number, digit: number): string =>
    (Math.floor(Math.random() * (max + min))).toString().padStart(digit, '0');

  let detail: OrderDetailItem[] = [];
  for (const i in order.detail) {
    detail.push({ title: order.detail[i].title, price: order.detail[i].price, qty: order.detail[i].qty });
  }
  const d = new Date();
  const orderDatetime: string = d.toLocaleDateString('sv-SE') + ' ' + d.toLocaleTimeString('sv-SE');
  const orderno: string = random(1, 1000, 3) + '-' + random(1, 10000000, 7) + '-' + random(1, 10000000, 7);
  return { orderno, orderDatetime, total: order.total, payment: order.payment, detail };
};

export const shopReducer = (state: ShopState, action: ShopAction): ShopState => {
  switch (action.type) {
    case SIGNIN_USERNAME:
      return { ...state, username: action.payload.username };

    case ADD_ORDER:
      return {
        ...state,
        order: [
          makeOrder(action.payload.order),
          ...state.order,
        ]
      };
    default:
      throw new Error('No such action type');
  }
};
