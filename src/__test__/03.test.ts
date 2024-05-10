/*
 * cd shop demo program
 *
 * hidekuno@gmail.com
 *
 */
import '@testing-library/jest-dom';
import {screen, waitFor, fireEvent,} from '@testing-library/react';
import {cartReducer} from '../reducers/cartReducer';
import {DEL_POINT, SIGNIN_USERNAME} from '../constants';
import {shopReducer} from '../reducers/shopReducer';
import {testRender} from './common';
import {act} from 'react';

export const Response = class {
  status: number;
  constructor(uri: string) {
    this.status = 400;
  }
}

global.fetch = jest.fn().mockImplementation(() => new Response('public/cd-mini.json'));

if (!AbortSignal.timeout) {
  AbortSignal.timeout = (ms) => {
    const controller = new AbortController();
    setTimeout(() => controller.abort(new DOMException("TimeoutError")), ms);
    return controller.signal;
  };
}
jest.spyOn(console, 'error').mockImplementation(x => x);

describe('unit test etc', () => {
  //  Not able to test by typescript
  // test('exception  test', async () => {
  //   expect(() => shopReducer({username: '', order: []}, {type: 'TEST', payload: {username: 'hoge'}}))
  //     .toThrow(new Error('No such action type'));
  // })

  //  Not able to test by typescript
  // test('exception  test', async () => {
  //   expect(() => cartReducer({cart: [], point: 0}, {type: 'TEST', payload: null}))
  //     .toThrow(new Error('No such action type'));
  // })
  test('cart test zero eq', async () => {
    let rec = cartReducer({point: 0, cart:[]}, {type: DEL_POINT, payload: {point: 10},});
    expect(rec.point).toEqual(0);
  })
  test('fetch error test', async () => {
    await waitFor(() => testRender());
    expect(console.error).toBeCalled();
    const button = screen.getByTestId('CloseIcon');
    fireEvent.click(button);
  })
})
