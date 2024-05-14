/*
 * cd shop demo program
 *
 * hidekuno@gmail.com
 *
 */
import {ShopAction, Order}  from '../reducers/shopReducer';
import {ADD_ORDER, SIGNIN_USERNAME} from '../constants';

export const signinUsername = (username: string): ShopAction => ({
  type: SIGNIN_USERNAME,
  payload: {username,},
});

export const addOrder = (order: Order): ShopAction => ({
  type: ADD_ORDER,
  payload: {order},
});
