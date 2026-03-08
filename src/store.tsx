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
import {MusicItem, CartItem, OrderItem, ViewedItem, OrderEntry} from './types';
import {makeStock, calcCartQty, initMusicItem} from './utils';

type ShopContextType = {state: ShopState; dispatch: React.Dispatch<ShopAction>};
type CartContextType = {state: CartState; dispatch: React.Dispatch<CartAction>};

export const ShopContext = createContext<ShopContextType>({} as ShopContextType);
export const CartContext = createContext<CartContextType>({} as CartContextType);

interface StoreContextProviderProps {
  children: ReactNode;
}

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

export type {MusicItem, CartItem, OrderItem, ViewedItem, OrderEntry};
export {makeStock, calcCartQty, initMusicItem};
