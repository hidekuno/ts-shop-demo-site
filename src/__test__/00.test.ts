/*
 * cd shop demo program
 *
 * hidekuno@gmail.com
 *
 */
import {screen, waitFor, fireEvent} from '@testing-library/react';
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
  let component: any;

  test('snapshot test', async () => {
    await act(() => {component = testRender()});
    //await waitFor(() => {
    //  component = testRender();
    //});
    expect(component.container).toMatchSnapshot();
  });

  test('initial test', async () => {
    // await waitFor(() => testRender());
    await act(() => testRender());
    expect(screen.getAllByRole('button', { name: 'Cart' })).toHaveLength(10);
    expect(screen.getByText('There are no items in your cart.')).toBeInTheDocument();
  });

  test('add to cart click 1 test', async () => {
    await act(() => testRender());
    await act(() => {
      fireEvent.click(screen.getAllByRole('button', { name: 'Cart' })[0]);
    });
    expect(screen.getByText('In your cart')).toBeInTheDocument();
    expect(screen.getByText('Total Amount: $25')).toBeInTheDocument();

    await act(() => {
      fireEvent.click(screen.getAllByRole('button', { name: 'Cart' })[1]);
    });
    expect(screen.getByText('Total Amount: $48')).toBeInTheDocument();

    await act(() => {
      fireEvent.click(screen.getAllByRole('button', { name: 'Cart' })[2]);
    });
    expect(screen.getByText('Total Amount: $69')).toBeInTheDocument();
    expect(screen.getAllByText('Revolver')).toHaveLength(1);
  });
  test('delete click test', async () => {
    await act(() => testRender());
    await act(() => {
      fireEvent.click(screen.getAllByRole('button', { name: 'Cart' })[0]);
    });
    await act(() => {
      fireEvent.click(screen.getAllByRole('button', { name: 'Cart' })[1]);
    });
    await act(() => {
      fireEvent.click(screen.getAllByRole('button', { name: 'Cart' })[2]);
    });
    await act(() => {
      fireEvent.click(screen.getAllByRole('button', { name: 'Delete' })[2]);
    });
    await act(() => {
      fireEvent.click(screen.getAllByRole('button', { name: 'Delete' })[1]);
    });
    expect(screen.getByText('Total Amount: $21')).toBeInTheDocument();
    await act(() => {
      fireEvent.click(screen.getAllByRole('button', { name: 'Delete' })[0]);
    });
    expect(screen.getByText('There are no items in your cart.')).toBeInTheDocument();
  });

  test('delete click test multi', async () => {
    await act(() => testRender());
    await act(() => {
      fireEvent.click(screen.getAllByRole('button', { name: 'Cart' })[0]);
    });
    await act(() => {
      fireEvent.click(screen.getAllByRole('button', { name: 'Cart' })[0]);
    });
    await act(() => {
      fireEvent.click(screen.getAllByRole('button', { name: 'Delete' })[0]);
    });
    expect(screen.getByText('Total Amount: $25')).toBeInTheDocument();
  });

  test('image click test', async () => {
    await act(() => testRender());
    const revolver = screen.getByAltText('Revolver');

    await act(() => {
      fireEvent.click(revolver);
    });
    await act(() => {
      fireEvent.click(screen.getByRole('button', { name: 'Close' }));
    });
    await act(() => {
      fireEvent.click(revolver);
    });
    await act(() => {
      fireEvent.keyDown(screen.getByRole('button', { name: 'Close' }), {
        key: 'Escape',
        code: 'Escape',
        keyCode: 27,
        charCode: 27
      });
    });
  });
});
