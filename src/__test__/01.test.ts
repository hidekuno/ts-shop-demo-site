/*
 * cd shop demo program
 *
 * hidekuno@gmail.com
 *
 */
import {screen, fireEvent, within} from '@testing-library/react'
import '@testing-library/jest-dom'
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
  test('add to cart click 2unit test', async () => {
    await act(() => { testRender() })
    await act(() => {
      fireEvent.click(screen.getAllByRole('button', { name: 'Cart' })[0])
    })
    await act(() => {
      fireEvent.click(screen.getAllByRole('button', { name: 'Cart' })[0])
    })
    expect(screen.getByText('Total Amount: $50')).toBeInTheDocument()
    expect(screen.getByText('2')).toBeInTheDocument()
  })
  test('purchase click test', async () => {
    await act(() => { testRender() })
    await act(() => {
      fireEvent.click(screen.getAllByRole('button', { name: 'Cart' })[0])
    })
    await act(() => {
      fireEvent.click(screen.getAllByRole('button', { name: 'Cart' })[0])
    })

    await act(() => {
      fireEvent.click(screen.getByRole('button', { name: 'Buy' }))
    })
    expect(screen.getByText('Your Point: $100')).toBeInTheDocument()
    expect(screen.getAllByText('Total Amount: $50')).toHaveLength(2)
    expect(screen.getByText('Would you like to buy?')).toBeInTheDocument()
  })
  test('dialog cancel click test', async () => {
    await act(() => { testRender() })
    await act(() => {
      fireEvent.click(screen.getAllByRole('button', { name: 'Cart' })[0])
    })
    await act(() => {
      fireEvent.click(screen.getByRole('button', { name: 'Buy' }))
    })
    await act(() => {
      fireEvent.click(screen.getByRole('button', { name: 'Cancel' }))
    })

    await act(() => {
      expect(screen.queryByAltText('Would you like to buy?')).not.toBeInTheDocument()
    })
  })
  test('dialog escape key test', async () => {
    await act(() => { testRender() })
    await act(() => {
      fireEvent.click(screen.getAllByRole('button', { name: 'Cart' })[0])
    })
    await act(() => {
      fireEvent.click(screen.getByRole('button', { name: 'Buy' }))
    })
    await act(() => {
      fireEvent.keyDown(screen.getByRole('button', { name: 'Cancel' }), {
        key: 'Escape',
        code: 'Escape',
        keyCode: 27,
        charCode: 27
      })
    })
    await act(() => {
      expect(screen.queryByAltText('Would you like to buy?')).not.toBeInTheDocument()
    })
  })
  test('dialog use point change test', async () => {
    await act(() => { testRender() })
    await act(() => {
      fireEvent.click(screen.getAllByRole('button', { name: 'Cart' })[0])
    })
    await act(() => {
      fireEvent.click(screen.getAllByRole('button', { name: 'Cart' })[0])
    })
    await act(() => {
      fireEvent.click(screen.getByRole('button', { name: 'Buy' }))
    })
    await act(() => {
      const switchElement = screen.getByLabelText('Use Points')
      fireEvent.click(switchElement)
      fireEvent.change(switchElement, { target: { checked: true }})
    })
    expect(screen.getByText('Your Point: $50')).toBeInTheDocument()
    expect(screen.getByText('Total Amount: $0')).toBeInTheDocument()
  })
  test('dialog use point change test (0 point)', async () => {
    await act(() => { testRender() })
    await act(() => {
      fireEvent.click(screen.getAllByRole('button', { name: 'Cart' })[0])
    })
    await act(() => {
      fireEvent.click(screen.getAllByRole('button', { name: 'Cart' })[0])
    })
    await act(() => {
      fireEvent.click(screen.getAllByRole('button', { name: 'Cart' })[0])
    })
    await act(() => {
      fireEvent.click(screen.getAllByRole('button', { name: 'Cart' })[0])
    })
    await act(() => {
      fireEvent.click(screen.getAllByRole('button', { name: 'Cart' })[0])
    })
    await act(() => {
      fireEvent.click(screen.getByRole('button', { name: 'Buy' }))
    })
    await act(() => {
      const switchElement = screen.getByLabelText('Use Points')
      fireEvent.click(switchElement)
      fireEvent.change(switchElement, { target: { checked: true }})
    })
    expect(screen.getByText('Your Point: $0')).toBeInTheDocument()
    expect(screen.getByText('Total Amount: $25')).toBeInTheDocument()
  })
  test('select test', async () => {
    await act(() => { testRender() })
    const button = await act(() => within(screen.getByTestId('select-element')).getByText('CD'));
    await act(() => fireEvent.mouseDown(button));
    await act(() => {
      const options = within(within(screen.getByRole('presentation')).getByRole('listbox')).getAllByRole('option')
      fireEvent.click(options[1])
    });
    expect(button).toHaveTextContent('LP');
  })
})
