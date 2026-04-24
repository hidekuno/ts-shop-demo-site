/*
 * cd shop demo program
 *
 * hidekuno@gmail.com
 *
 */
import {createContext, useReducer, useMemo, ReactNode, JSX} from 'react';

import {cartReducer, CartState, CartAction} from './reducers/cartReducer';
import {shopReducer, ShopState, ShopAction} from './reducers/shopReducer';
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
  const [shopState, shopDispatch] = useReducer(shopReducer, {username: '', point: 100, order: [], views: []});
  const [cartState, cartDispatch] = useReducer(cartReducer, {cart: []});

  const shopValue = useMemo(() => ({state: shopState, dispatch: shopDispatch}), [shopState]);
  const cartValue = useMemo(() => ({state: cartState, dispatch: cartDispatch}), [cartState]);

  return (
    <ShopContext.Provider value={shopValue}>
      <CartContext.Provider value={cartValue}>
        {children}
      </CartContext.Provider>
    </ShopContext.Provider>
  );
};

export type {MusicItem, CartItem, OrderItem, ViewedItem, OrderEntry};
export {makeStock, calcCartQty, initMusicItem};
