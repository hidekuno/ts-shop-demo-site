/*
 * cd shop demo program
 *
 * hidekuno@gmail.com
 *
 */
import React, { createContext, useReducer, ReactNode } from 'react';

import { cartReducer, CartState, CartAction } from './reducers/cartReducer';
import { shopReducer, ShopState, ShopAction } from './reducers/shopReducer';
import { POINT_INIT_VAL } from './constants';

export const ShopContext = createContext<{ state: ShopState; dispatch: React.Dispatch<ShopAction> }>(
    { state: { username: '', order: [] }, dispatch: () => null }
);

export const CartContext = createContext<{ state: CartState; dispatch: React.Dispatch<CartAction> }>(
    { state: { cart: [], point: POINT_INIT_VAL }, dispatch: () => null }
);

interface StoreContextProviderProps {
  children: ReactNode;
}

export const StoreContextProvider = ({ children }: StoreContextProviderProps): JSX.Element => {
  const [shopState, shopDispatch] = useReducer(shopReducer, { username: '', order: [] });
  const [cartState, cartDispatch] = useReducer(cartReducer, { cart: [], point: POINT_INIT_VAL });

  return (
    <ShopContext.Provider value={{ state: shopState, dispatch: shopDispatch }}>
      <CartContext.Provider value={{ state: cartState, dispatch: cartDispatch }}>
        {children}
      </CartContext.Provider>
    </ShopContext.Provider>
  );
};
