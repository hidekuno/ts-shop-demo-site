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

global.fetch = jest.fn().mockImplementation(() => new Response('public/cd-mini.json'));

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
      // fireEvent.click(screen.getAllByRole('link')[1]);
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
      // fireEvent.click(screen.getByRole('tab', {name: 'Order', selected: false }));
      fireEvent.click(screen.getByText('Order'));
    });
    expect(screen.getByText(/Order History/)).toBeInTheDocument();

    await act(() => {
      fireEvent.click(screen.getByRole('tab', {name: 'Cart', selected: false}));
    });
    expect(screen.getByText(/There are no items in your cart./)).toBeInTheDocument();

    await act(() => {
      fireEvent.click(screen.getAllByRole('link')[0]);
    });
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
      fireEvent.click(screen.getByRole('tab', {name: 'Cart', selected: false}));
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
  });
});
