/*
 * cd shop demo program
 *
 * hidekuno@gmail.com
 *
 */
import {ShopAction}  from '../reducers/shopReducer';
import {ADD_ORDER, SIGNIN_USERNAME, ADD_VIEWED} from '../constants';
import {OrderEntry,MusicItem} from '../store';

export const signinUsername = (username: string): ShopAction => ({
  type: SIGNIN_USERNAME,
  payload: {username,},
});

export const addOrder = (order: OrderEntry): ShopAction => ({
  type: ADD_ORDER,
  payload: {order},
});

export const addViewed = (item: MusicItem): ShopAction => ({
  type: ADD_VIEWED,
  payload: item,
});
