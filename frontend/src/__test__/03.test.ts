/*
 * cd shop demo program
 *
 * hidekuno@gmail.com
 *
 */
import '@testing-library/jest-dom';
import {screen, waitFor, fireEvent,} from '@testing-library/react';
import {testRender} from './common';

export const Response = class {
  status: number;

  constructor(_uri: string) {
    this.status = 400;
  }
};

global.fetch = jest.fn().mockImplementation(() => new Response('public/cd-mini.json'));

if (!AbortSignal.timeout) {
  AbortSignal.timeout = (ms) => {
    const controller = new AbortController();
    setTimeout(() => controller.abort(new DOMException('TimeoutError')), ms);
    return controller.signal;
  };
}
describe('unit test etc', () => {
  test('fetch error test', async () => {
    await waitFor(() => testRender());
    await waitFor(() => {
      const button = screen.getByTestId('CloseIcon');
      fireEvent.click(button);
    });
  });
});
