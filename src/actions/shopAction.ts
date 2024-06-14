/*
 * cd shop demo program
 *
 * hidekuno@gmail.com
 *
 */
import {ShopAction}  from '../reducers/shopReducer';
import {ADD_ORDER, SIGNIN_USERNAME} from '../constants';
import {OrderEntry} from '../store';

export const signinUsername = (username: string): ShopAction => ({
  type: SIGNIN_USERNAME,
  payload: {username,},
});

export const addOrder = (order: OrderEntry): ShopAction => ({
  type: ADD_ORDER,
  payload: {order},
});
