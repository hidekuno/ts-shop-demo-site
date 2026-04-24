/*
 * cd shop demo program
 *
 * hidekuno@gmail.com
 *
 */
import {render} from '@testing-library/react';
import {Store, Order, Cart, Viewed} from '../App';
import {Signin} from '../components/Signin';
import {StoreContextProvider} from '../store';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import {Shop} from '../components/Shop';
import {Cart as CartPart} from '../components/Cart';
import * as fs from 'fs';


export class Response {
  filename: string;
  ok: boolean;
  status: number;
  data: any;

  constructor(filename: string, ok = true, status = 200, data: any = null) {
    this.filename = filename;
    this.ok = ok;
    this.status = status;
    this.data = data;
  }

  async json(): Promise<any> {
    if (this.data) {
        return this.data;
    }
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
          <Route path={'/viewed'} element={<Viewed />} />
          <Route path={'/cart'} element={<Cart />} />
          <Route path={'/order'} element={<Order />} />
          <Route path={'*'} element={<Signin />} />
        </Routes>
      </BrowserRouter>
    </StoreContextProvider>
  );
};
