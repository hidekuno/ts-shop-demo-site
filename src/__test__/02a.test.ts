/*
 * cd shop demo program
 *
 * hidekuno@gmail.com
 *
 */
import {screen, waitFor, fireEvent,} from '@testing-library/react';
import '@testing-library/jest-dom';
import {testRender, Response} from './common';
import {act} from 'react';

global.fetch = jest.fn().mockImplementation(() => new Response('public/cd-mini.json'));
if (!AbortSignal.timeout) {
  AbortSignal.timeout = (ms) => {
    const controller = new AbortController();
    setTimeout(() => controller.abort(new DOMException("TimeoutError")), ms);
    return controller.signal;
  };
}

describe('unit test', () => {
  test('dialog ok click test', async () => {
    await act(() => { testRender() })
    await act(() => {
      fireEvent.click(screen.getAllByRole('button', {name: 'Cart'})[0])
    });
    await act(() => {
      fireEvent.click(screen.getAllByRole('button', {name: 'Cart'})[0])
    });
    await act(() => {
      fireEvent.click(screen.getByRole('button', {name: 'Buy'}))
    });
    await act(() => {
      const switchElement = screen.getByLabelText('Use Points')
      fireEvent.click(switchElement)
      fireEvent.change(switchElement, { target: { checked: true }})
    });
    expect(screen.getByText('Your Point: $50')).toBeInTheDocument();
    expect(screen.getByText('Total Amount: $0')).toBeInTheDocument();
    const textMail = screen.getByRole('textbox', {name: 'Email'});
    fireEvent.change(textMail, {target: {value: 'foo@hoge.com'}});
    const textAddress = screen.getByRole('textbox', {name: 'Address'});
    fireEvent.change(textAddress, {target: {value: 'Osaka,Japan'}});

    await act(() => {
      fireEvent.click(screen.getByRole('button', {name: 'OK'}))
    });
    expect(screen.getByText('Complete')).toBeInTheDocument();
    expect(screen.getByText(/Thanks for your purchase./)).toBeInTheDocument();
    expect(screen.getByText(/\(This is a Demo Program.\)/)).toBeInTheDocument();

    await act(() => {
      fireEvent.click(screen.getByRole('button', {name: 'Close'}))
    });
    expect(screen.getByText('There are no items in your cart.')).toBeInTheDocument();
  })
  test('dialog escape key test', async () => {
    await act(() => testRender());
    await act(() => {
      fireEvent.click(screen.getAllByRole('button', {name: 'Cart'})[0])
    });
    await act(() => {
      fireEvent.click(screen.getByRole('button', {name: 'Buy'}))
    });
    await act(() => {
      const switchElement = screen.getByLabelText('Use Points');
      fireEvent.click(switchElement);
      fireEvent.change(switchElement, { target: { checked: true }});
    });
    expect(screen.getByText('Your Point: $75')).toBeInTheDocument();
    expect(screen.getByText('Total Amount: $0')).toBeInTheDocument();
    const textMail = screen.getByRole('textbox', {name: 'Email'});
    fireEvent.change(textMail, {target: {value: 'foo@hoge.com'}});
    const textAddress = screen.getByRole('textbox', {name: 'Address'});
    fireEvent.change(textAddress, {target: {value: 'Osaka,Japan'}});

    await act(() => {
      fireEvent.click(screen.getByRole('button', {name: 'OK'}));
    })
    expect(screen.getByText('Complete')).toBeInTheDocument();
    expect(screen.getByText(/Thanks for your purchase./)).toBeInTheDocument();
    expect(screen.getByText(/\(This is a Demo Program.\)/)).toBeInTheDocument();

    await act(() => {
      fireEvent.keyDown(screen.getByRole('button', {name: 'Close'}), {
        key: 'Escape',
        code: 'Escape',
        keyCode: 27,
        charCode: 27
      })
    });
    expect(screen.getByText('There are no items in your cart.')).toBeInTheDocument();
  })
  test('dialog ok click test point less zero', async () => {
    await act(() => testRender());
    await act(() => {
      fireEvent.click(screen.getAllByRole('button', {name: 'Cart'})[0])
    });
    await act(() => {
      fireEvent.click(screen.getAllByRole('button', {name: 'Cart'})[0])
    });
    await act(() => {
      fireEvent.click(screen.getAllByRole('button', {name: 'Cart'})[0])
    });
    await act(() => {
      fireEvent.click(screen.getAllByRole('button', {name: 'Cart'})[0])
    });
    await act(() => {
      fireEvent.click(screen.getAllByRole('button', {name: 'Cart'})[0])
    });
    await act(() => {
      fireEvent.click(screen.getByRole('button', {name: 'Buy'}))
    });
    await act(() => {
      const switchElement = screen.getByLabelText('Use Points')
      fireEvent.click(switchElement)
      fireEvent.change(switchElement, { target: { checked: true }})
    });
    expect(screen.getByText('Your Point: $0')).toBeInTheDocument();
    expect(screen.getByText('Total Amount: $25')).toBeInTheDocument();
    const textMail = screen.getByRole('textbox', {name: 'Email'});
    fireEvent.change(textMail, {target: {value: 'foo@hoge.com'}});
    const textAddress = screen.getByRole('textbox', {name: 'Address'});
    fireEvent.change(textAddress, {target: {value: 'Osaka,Japan'}});

    await act(() => {
      fireEvent.click(screen.getByRole('button', {name: 'OK'}))
    });
    expect(screen.getByText('Complete')).toBeInTheDocument();
    expect(screen.getByText(/Thanks for your purchase./)).toBeInTheDocument();
    expect(screen.getByText(/\(This is a Demo Program.\)/)).toBeInTheDocument();

    await act(() => {
      fireEvent.click(screen.getByRole('button', {name: 'Close'}))
    });
    expect(screen.getByText('There are no items in your cart.')).toBeInTheDocument();
  })
})
