/*
 * cd shop demo program
 *
 * hidekuno@gmail.com
 *
 */
import {createContext, useReducer, ReactNode, JSX} from 'react';

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
  const stockMap = new Map<number, number>();

  const updateStockMap = (id: number, qty: number) => {
    stockMap.set(id, (stockMap.get(id) || 0) + qty);
  };

  for (const orderItem of order) {
    for (const detailItem of orderItem.detail) {
      updateStockMap(detailItem.item.id, detailItem.qty);
    }
  }
  for (const cartItem of cart) {
    updateStockMap(cartItem.item.id, cartItem.qty);
  }

  return jsonData.map((musicItem: MusicItem) => {
    const deductedStock = stockMap.get(musicItem.id) || 0;
    return {...musicItem, stock: musicItem.stock - deductedStock};
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
