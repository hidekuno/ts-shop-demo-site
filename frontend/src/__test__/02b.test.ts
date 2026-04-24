/*
 * cd shop demo program
 *
 * hidekuno@gmail.com
 *
 */
import {screen, fireEvent,} from '@testing-library/react';
import '@testing-library/jest-dom';
import {testRender, Response} from './common';
import {act} from 'react';

global.fetch = jest.fn().mockImplementation((url: string, options: any) => {
  const method = options?.method || 'GET';
  if (url.includes('/token')) {
    return new Response('', true, 200, { access_token: 'fake_token' });
  }
  if (url.includes('/users/me')) {
    return new Response('', true, 200, { username: 'testtaro', point: 100 });
  }
  if (url.includes('/items')) {
    return new Response('public/cd-mini.json');
  }
  if (url.includes('/orders')) {
    if (method === 'GET') {
       return new Response('', true, 200, []);
    }
    return new Response('', true, 200, {
      order_no: 1,
      order_datetime: '2023-01-01 00:00:00',
      total: 100,
      payment: 100,
      detail: []
    });
  }
  return new Response('public/cd-mini.json');
});
if (!AbortSignal.timeout) {
  AbortSignal.timeout = (ms) => {
    const controller = new AbortController();
    setTimeout(() => controller.abort(new DOMException('TimeoutError')), ms);
    return controller.signal;
  };
}

describe('unit test', () => {
  test('dialog ok click test(no point)', async () => {
    await act(() => testRender());
    await act(() => {
      fireEvent.click(screen.getAllByRole('button', {name: 'Cart'})[0]);
    });
    await act(() => {
      fireEvent.click(screen.getAllByRole('button', {name: 'Cart'})[0]);
    });
    await act(() => {
      fireEvent.click(screen.getByRole('button', {name: 'Buy'}));
    });
    expect(screen.getByText('Your Point: $100')).toBeInTheDocument();
    expect(screen.getAllByText('Total Amount: $50')).toHaveLength(2);
    const textMail = screen.getByRole('textbox', {name: 'Email'});
    fireEvent.change(textMail, {target: {value: 'foo@hoge.com'}});
    const textAddress = screen.getByRole('textbox', {name: 'Address'});
    fireEvent.change(textAddress, {target: {value: 'Osaka,Japan'}});

    await act(() => {
      fireEvent.click(screen.getByRole('button', {name: 'OK'}));
    });
    expect(screen.getByText('Complete')).toBeInTheDocument();
    expect(screen.getByText(/Thanks for your purchase./)).toBeInTheDocument();
    expect(screen.getByText(/\(This is a Demo Program.\)/)).toBeInTheDocument();

    await act(() => {
      fireEvent.click(screen.getByRole('button', {name: 'Close'}));
    });
    expect(screen.getByText('There are no items in your cart.')).toBeInTheDocument();
  });
  test('email required validate test', async () => {
    await act(() => testRender());
    await act(() => {
      fireEvent.click(screen.getAllByRole('button', {name: 'Cart'})[0]);
    });
    await act(() => {
      fireEvent.click(screen.getByRole('button', {name: 'Buy'}));
    });
    await act(() => {
      fireEvent.click(screen.getByRole('button', {name: 'OK'}));
    });
    expect(screen.queryByAltText('Would you like to buy?')).not.toBeInTheDocument();
    const textMail = screen.getByRole('textbox', {name: 'Email'});
    expect(screen.queryAllByText('Constraints not satisfied')[0]).toBeInTheDocument();
    expect(textMail).toBeInvalid();
  });
  test('email format validate test', async () => {
    await act(() => testRender());
    await act(() => {
      fireEvent.click(screen.getAllByRole('button', {name: 'Cart'})[0]);
    });
    await act(() => {
      fireEvent.click(screen.getByRole('button', {name: 'Buy'}));
    });
    const textMail = screen.getByRole('textbox', {name: 'Email'});
    fireEvent.change(textMail, {target: {value: 'foo@hoge.'}});

    await act(() => {
      fireEvent.click(screen.getByRole('button', {name: 'OK'}));
    });
    expect(screen.queryByAltText('Would you like to buy?')).not.toBeInTheDocument();
    expect(screen.queryAllByText('Constraints not satisfied')[0]).toBeInTheDocument();
    expect(textMail).toBeInvalid();
  });
  test('address format validate test', async () => {
    await act(() => testRender());
    await act(() => {
      fireEvent.click(screen.getAllByRole('button', {name: 'Cart'})[0]);
    });
    await act(() => {
      fireEvent.click(screen.getByRole('button', {name: 'Buy'}));
    });
    const textMail = screen.getByRole('textbox', {name: 'Email'});
    fireEvent.change(textMail, {target: {value: 'foo@hoge.com'}});

    await act(() => {
      fireEvent.click(screen.getByRole('button', {name: 'OK'}));
    });
    expect(screen.queryByAltText('Would you like to buy?')).not.toBeInTheDocument();
    expect(screen.queryAllByText('Constraints not satisfied')[0]).toBeInTheDocument();
    const textAddr = screen.getByRole('textbox', {name: 'Address'});
    expect(textAddr).toBeInvalid();
  });
});
