/*
 * cd shop demo program
 *
 * hidekuno@gmail.com
 *
 */
import {MusicItem, CartItem} from '../store';
import {CartAction}  from '../reducers/cartReducer';
import {ADD_ITEM, DEL_ITEM, CLEAR_ITEMS} from '../constants';

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
