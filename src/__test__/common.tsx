/*
 * cd shop demo program
 *
 * hidekuno@gmail.com
 *
 */
import {render} from '@testing-library/react';
import {Store, Order, Cart} from '../App';
import {Signin} from '../components/Signin';
import {StoreContextProvider} from '../store';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import {Shop} from '../components/Shop';
import {Cart as CartPart} from '../components/Cart';
import * as fs from 'fs';


export class Response {
  filename: string;

  constructor(filename: string) {
    this.filename = filename;
  }

  json(): any { // Return type changed to any for now
    return JSON.parse(fs.readFileSync(this.filename, 'utf8'));
  }
}

export const testRender = () => {
  return render(
    <StoreContextProvider>
      <Shop />
      <CartPart />
    </StoreContextProvider>
  );
};
export const testLoginRender = () => {
  return render(
    <StoreContextProvider>
      <BrowserRouter>
        <Routes>
          <Route path={'/'} element={<Signin />} />
          <Route path={'/shop'} element={<Store />} />
          <Route path={'/cart'} element={<Cart />} />
          <Route path={'/order'} element={<Order />} />
          <Route path={'*'} element={<Signin />} />
        </Routes>
      </BrowserRouter>
    </StoreContextProvider>
  );
};
