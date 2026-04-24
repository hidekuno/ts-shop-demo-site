/*
 * cd shop demo program
 *
 * hidekuno@gmail.com
 *
 */
import {screen, waitFor, fireEvent} from '@testing-library/react';
import '@testing-library/jest-dom';
import {testLoginRender, Response} from './common';
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
  if (url.includes('/views')) {
    return new Response('', true, 200, { viewed_datetime: '2023-01-01 00:00:00' });
  }
  if (url.includes('/orders')) {
    const data = [
      {
        order_no: 1,
        order_datetime: '2023-01-01 00:00:00',
        total: 48,
        payment: 48,
        detail: [
          {
            item: {
              id: 1,
              title: 'Revolver',
              artist: 'The Beatles',
              price: 25,
              image_url: 'https://m.media-amazon.com/images/I/617oXibcXRL._AC_UL320_.jpg',
              description: '...',
              stock: 10,
              digital: false
            },
            qty: 1
          },
          {
            item: {
              id: 2,
              title: 'Pet Shop Sounds',
              artist: 'The Beach Boys',
              price: 23,
              image_url: 'https://m.media-amazon.com/images/I/51D4ZYSXJ6L._AC_UL320_.jpg',
              description: '...',
              stock: 1,
              digital: false
            },
            qty: 1
          }
        ]
      }
    ];
    if (method === 'GET') {
       return new Response('', true, 200, data);
    }
    return new Response('', true, 200, data[0]);
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
jest.spyOn(console, 'error').mockImplementation(x => x);

describe('unit test link', () => {
  test('sign in/out test', async () => {
    await act(() => testLoginRender());

    const textUser = screen.getByRole('textbox', {name: 'Username'});
    fireEvent.change(textUser, {target: {value: 'testtaro'}});

    // It's not work screen.getByRole('textbox', {name: 'Password'});
    const textPassword =  screen.getByLabelText(/Password/);
    fireEvent.change(textPassword, {target: {value: 'hogehoge'}});

    await act(() => {
      fireEvent.click(screen.getAllByRole('button')[0]);
    });
    expect(screen.getByText('testtaro')).toBeInTheDocument();
    expect(screen.getByText(/Sign out/)).toBeInTheDocument();
    await waitFor(() => {
      fireEvent.click(screen.getByText(/Sign out/));
    });
    expect(screen.getByText(/Sign in to CD Shop/)).toBeInTheDocument();
  });
  test('tab', async () => {
    await act(() => { testLoginRender(); });

    const textUser = screen.getByRole('textbox', {name: 'Username'});
    fireEvent.change(textUser, {target: {value: 'testtaro'}});

    // It's not work screen.getByRole('textbox', {name: 'Password'});
    const textPassword =  screen.getByLabelText(/Password/);
    fireEvent.change(textPassword, {target: {value: 'hogehoge'}});

    await act(() => {
      fireEvent.click(screen.getAllByRole('button')[0]);
    });
    expect(screen.getByText('testtaro')).toBeInTheDocument();

    await act(() => {
      fireEvent.click(screen.getByText('Order'));
    });
    expect(screen.getByText(/Order History/)).toBeInTheDocument();

    await act(() => {
      fireEvent.click(screen.getByRole('tab', {name: 'Cart', selected: false}));
    });
    expect(screen.getByText(/There are no items in your cart./)).toBeInTheDocument();
  });
  test('order', async () => {
    await act(() => { testLoginRender(); });

    const textUser = screen.getByRole('textbox', {name: 'Username'});
    fireEvent.change(textUser, {target: {value: 'testtaro'}});

    // It's not work screen.getByRole('textbox', {name: 'Password'});
    const textPassword =  screen.getByLabelText(/Password/);
    fireEvent.change(textPassword, {target: {value: 'hogehoge'}});

    await act(() => {
      fireEvent.click(screen.getAllByRole('button')[0]);
    });
    expect(screen.getByText('testtaro')).toBeInTheDocument();

    await act(() => {
      fireEvent.click(screen.getAllByRole('button', {name: 'Cart'})[0]);
    });
    await act(() => {
      fireEvent.click(screen.getAllByRole('button', {name: 'Cart'})[1]);
    });
    await act(() => {
      fireEvent.click(screen.getByRole('tab', {name: /Cart/, selected: false}));
    });
    await act(() => {
      fireEvent.click(screen.getByRole('button', {name: 'Buy'}));
    });
    const textMail = screen.getByRole('textbox', {name: 'Email'});
    fireEvent.change(textMail, {target: {value: 'foo@hoge.com'}});
    const textAddress = screen.getByRole('textbox', {name: 'Address'});
    fireEvent.change(textAddress, {target: {value: 'Osaka,Japan'}});
    await act(() => {
      fireEvent.click(screen.getByRole('button', {name: 'OK'}));
    });
    await act(() => {
      fireEvent.click(screen.getByRole('button', {name: 'Close'}));
    });
    await act(() => {
      //fireEvent.click(screen.getByRole('tab', {name: 'Order', selected: false }));
      fireEvent.click(screen.getByText('Order'));
    });
    expect(screen.getByText(/Order History/)).toBeInTheDocument();
    expect(screen.getByText('Revolver')).toBeInTheDocument();
    expect(screen.getByText('Pet Shop Sounds')).toBeInTheDocument();
    expect(screen.getAllByText('$48')).toHaveLength(2);
    expect(screen.getByText('$25')).toBeInTheDocument();
    await act(() => {
      fireEvent.click(screen.getByText('Shop'));
    });
  });
  test('viewed', async () => {
    await act(() => { testLoginRender(); });

    const textUser = screen.getByRole('textbox', {name: 'Username'});
    fireEvent.change(textUser, {target: {value: 'testtaro'}});

    // It's not work screen.getByRole('textbox', {name: 'Password'});
    const textPassword =  screen.getByLabelText(/Password/);
    fireEvent.change(textPassword, {target: {value: 'hogehoge'}});

    await act(() => {
      fireEvent.click(screen.getAllByRole('button')[0]);
    });
    fireEvent.click(screen.getByAltText(/Revolver/));
    await act(() => {
      fireEvent.click(screen.getByRole('button', {name: 'Close'}));
    });
    await act(() => {
      fireEvent.click(screen.getByText('Viewed'));
    });
  });
});
