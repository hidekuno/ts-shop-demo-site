/*
 * cd shop demo program
 *
 * hidekuno@gmail.com
 *
 */
import {SET_USER, SET_ORDERS, SET_VIEWS, ADD_ORDER, ADD_VIEWED} from '../constants';
import {OrderItem, ViewedItem} from '../types';
import {ShopAction} from '../reducers/shopReducer';

export const setUser = (username: string, point: number): ShopAction => ({
  type: SET_USER,
  payload: {username, point},
});

export const setOrders = (orders: OrderItem[]): ShopAction => ({
  type: SET_ORDERS,
  payload: orders,
});

export const setViews = (views: ViewedItem[]): ShopAction => ({
  type: SET_VIEWS,
  payload: views,
});

export const addOrderAction = (order: OrderItem): ShopAction => ({
  type: ADD_ORDER,
  payload: order,
});

export const addViewedAction = (viewed: ViewedItem): ShopAction => ({
  type: ADD_VIEWED,
  payload: viewed,
});
