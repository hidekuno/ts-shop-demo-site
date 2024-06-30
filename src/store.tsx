/*
 * cd shop demo program
 *
 * hidekuno@gmail.com
 *
 */
import React, {createContext, useReducer, ReactNode} from 'react';

import {cartReducer, CartState, CartAction} from './reducers/cartReducer';
import {shopReducer, ShopState, ShopAction} from './reducers/shopReducer';
import {POINT_INIT_VAL} from './constants';

type ShopContextType = {state: ShopState; dispatch: React.Dispatch<ShopAction>};
type CartContextType = {state: CartState; dispatch: React.Dispatch<CartAction>};

export const ShopContext = createContext<ShopContextType>({} as ShopContextType);
export const CartContext = createContext<CartContextType>({} as CartContextType);

export interface MusicItem {
  id: number;
  title: string;
  artist: string;
  imageUrl: string;
  description: string;
  price: number;
  stock: number;
  digital: boolean;
}
export interface CartItem {
  item: MusicItem,
  qty: number;
}
export interface OrderItem {
  orderno: string;
  orderDatetime: string;
  total: number;
  payment: number;
  detail: CartItem[];
}
export interface OrderEntry {
  total: number;
  payment: number;
  detail: CartItem[];
}
export interface ViewedItem {
  datetime: string;
  item: MusicItem;
}

interface StoreContextProviderProps {
  children: ReactNode;
}

export const makeStock = (jsonData: MusicItem[], order: OrderItem[], cart: CartItem[]) => {
  const m = new Map();
  for (const item of order.map((row) => (row.detail.map((item) => [item.item.id,item.qty])))) {
    for (const rec of item) {
      const [k,v] = rec;
      if(m.has(k)) {
        m.set(k, m.get(k) + v);
      } else {
        m.set(k, v);
      }
    }
  }
  for (const rec of cart) {
    if(m.has(rec.item.id)) {
      m.set(rec.item.id, m.get(rec.item.id) + rec.qty);
    } else {
      m.set(rec.item.id, rec.qty);
    }
  }
  return jsonData.map((row:MusicItem) => {
    row.stock = m.has(row.id) ? row.stock - m.get(row.id) : row.stock;
    return row;
  });
};

export const calcCartQty = (cart: CartItem[]) => cart.reduce((sum, current) => sum + current.qty,0);

export const initMusicItem = () => ({
  id: 0,
  title: '',
  artist: '',
  imageUrl: '',
  description: '',
  price: 0,
  stock: 0,
  digital:
  false});

export const StoreContextProvider = ({children}: StoreContextProviderProps): JSX.Element => {
  const [shopState, shopDispatch] = useReducer(shopReducer, {username: '', order: [], views: []});
  const [cartState, cartDispatch] = useReducer(cartReducer, {cart: [], point: POINT_INIT_VAL});

  return (
    <ShopContext.Provider value={{state: shopState, dispatch: shopDispatch}}>
      <CartContext.Provider value={{state: cartState, dispatch: cartDispatch}}>
        {children}
      </CartContext.Provider>
    </ShopContext.Provider>
  );
};
