/*
 * cd shop demo program
 *
 * hidekuno@gmail.com
 *
 */
import {MusicItem} from '../data';
import {CartItem, CartAction}  from '../reducers/cartReducer';
import {ADD_ITEM, DEL_ITEM, CLEAR_ITEMS, ADD_POINT, DEL_POINT} from '../constants';

export const addToCart = (item: MusicItem): CartAction => ({
  type: ADD_ITEM,
  payload: item,
});

export const delToCart = (item: CartItem): CartAction => ({
  type: DEL_ITEM,
  payload: item,
});

export const clearToCart = (): CartAction => ({
  type: CLEAR_ITEMS,
});

export const addPoint = (point: number): CartAction => ({
  type: ADD_POINT,
  payload: {point},
});

export const delPoint = (point: number): CartAction => ({
  type: DEL_POINT,
  payload: {point},
});
