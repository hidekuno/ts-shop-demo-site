/*
 * cd shop demo program
 *
 * hidekuno@gmail.com
 *
 */
import {renderHook, act} from '@testing-library/react';
import {useCartCalculations} from '../hooks/useCartCalculations';
import {shopReducer, ShopState} from '../reducers/shopReducer';
import {cartReducer, CartState} from '../reducers/cartReducer';
import {MusicItem, CartItem, OrderItem, ViewedItem} from '../types';

const baseItem: MusicItem = {
  id: 1, title: 'Test', artist: 'Artist',
  imageUrl: '', description: '', price: 50, stock: 5, digital: false,
};

describe('shopReducer', () => {
  const initialState: ShopState = {username: '', point: 0, order: [], views: []};

  test('SET_ORDERS replaces order list', () => {
    const orders: OrderItem[] = [{orderno: '1', orderDatetime: '2023-01-01', total: 100, payment: 100, detail: []}];
    const state = shopReducer(initialState, {type: 'SET_ORDERS', payload: orders});
    expect(state.order).toEqual(orders);
    expect(state.username).toBe('');
  });

  test('SET_VIEWS replaces views list', () => {
    const views: ViewedItem[] = [{datetime: '2023-01-01', item: baseItem}];
    const state = shopReducer(initialState, {type: 'SET_VIEWS', payload: views});
    expect(state.views).toEqual(views);
  });

  test('ADD_ORDER prepends to order list', () => {
    const existing: OrderItem = {orderno: '1', orderDatetime: '2023-01-01', total: 50, payment: 50, detail: []};
    const newOrder: OrderItem = {orderno: '2', orderDatetime: '2023-02-01', total: 100, payment: 100, detail: []};
    const state = shopReducer({...initialState, order: [existing]}, {type: 'ADD_ORDER', payload: newOrder});
    expect(state.order[0].orderno).toBe('2');
    expect(state.order).toHaveLength(2);
  });

  test('ADD_VIEWED prepends to views list', () => {
    const view: ViewedItem = {datetime: '2023-01-01', item: baseItem};
    const state = shopReducer(initialState, {type: 'ADD_VIEWED', payload: view});
    expect(state.views[0]).toEqual(view);
  });

  test('default returns state unchanged', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const state = shopReducer(initialState, {type: 'UNKNOWN'} as any);
    expect(state).toEqual(initialState);
  });
});

describe('cartReducer', () => {
  const initialState: CartState = {cart: []};

  test('ADD_ITEM adds new item with qty 1', () => {
    const state = cartReducer(initialState, {type: 'ADD_ITEM', payload: baseItem});
    expect(state.cart).toHaveLength(1);
    expect(state.cart[0].qty).toBe(1);
  });

  test('ADD_ITEM increments qty for existing item', () => {
    const withItem: CartState = {cart: [{item: baseItem, qty: 1}]};
    const state = cartReducer(withItem, {type: 'ADD_ITEM', payload: baseItem});
    expect(state.cart[0].qty).toBe(2);
  });

  test('DEL_ITEM removes item when qty is 1', () => {
    const withItem: CartState = {cart: [{item: baseItem, qty: 1}]};
    const state = cartReducer(withItem, {type: 'DEL_ITEM', payload: {item: baseItem, qty: 1}});
    expect(state.cart).toHaveLength(0);
  });

  test('DEL_ITEM decrements qty when qty > 1', () => {
    const withItem: CartState = {cart: [{item: baseItem, qty: 3}]};
    const state = cartReducer(withItem, {type: 'DEL_ITEM', payload: {item: baseItem, qty: 3}});
    expect(state.cart[0].qty).toBe(2);
  });

  test('DEL_ITEM does nothing when item not in cart', () => {
    const state = cartReducer(initialState, {type: 'DEL_ITEM', payload: {item: baseItem, qty: 1}});
    expect(state).toEqual(initialState);
  });

  test('CLEAR_ITEMS empties the cart', () => {
    const withItem: CartState = {cart: [{item: baseItem, qty: 2}]};
    const state = cartReducer(withItem, {type: 'CLEAR_ITEMS'});
    expect(state.cart).toHaveLength(0);
  });

  test('default returns state unchanged', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const state = cartReducer(initialState, {type: 'UNKNOWN'} as any);
    expect(state).toEqual(initialState);
  });
});

describe('useCartCalculations', () => {
  const makeCart = (qty: number): CartItem[] => [{item: baseItem, qty}];

  test('calcTotalPayment returns total when not using points', () => {
    const {result} = renderHook(() => useCartCalculations(makeCart(2), 100));
    expect(result.current.calcTotalPayment(false)).toBe(100);
  });

  test('calcTotalPayment deducts points when using points', () => {
    const {result} = renderHook(() => useCartCalculations(makeCart(2), 30));
    expect(result.current.calcTotalPayment(true)).toBe(70);
  });

  test('calcTotalPayment returns 0 when points exceed total', () => {
    const {result} = renderHook(() => useCartCalculations(makeCart(1), 200));
    expect(result.current.calcTotalPayment(true)).toBe(0);
  });

  test('calcRemainingPoint returns userPoint when not using points', () => {
    const {result} = renderHook(() => useCartCalculations(makeCart(1), 100));
    expect(result.current.calcRemainingPoint(false)).toBe(100);
  });

  test('calcRemainingPoint deducts total when using points', () => {
    const {result} = renderHook(() => useCartCalculations(makeCart(1), 100));
    expect(result.current.calcRemainingPoint(true)).toBe(50);
  });

  test('calcRemainingPoint returns 0 when total exceeds userPoint', () => {
    const {result} = renderHook(() => useCartCalculations(makeCart(1), 20));
    expect(result.current.calcRemainingPoint(true)).toBe(0);
  });

  test('calcEarnedPoint returns 0 when using points', () => {
    const {result} = renderHook(() => useCartCalculations(makeCart(1), 100));
    expect(result.current.calcEarnedPoint(true)).toBe(0);
  });

  test('calcEarnedPoint returns floor of total/10', () => {
    const {result} = renderHook(() => useCartCalculations(makeCart(1), 100));
    expect(result.current.calcEarnedPoint(false)).toBe(5);
  });

  test('setChecked toggles the checked state', () => {
    const {result} = renderHook(() => useCartCalculations(makeCart(1), 100));
    expect(result.current.checked).toBe(false);
    act(() => { result.current.setChecked(true); });
    expect(result.current.checked).toBe(true);
  });

  test('totalPrices is calculated from cart items', () => {
    const {result} = renderHook(() => useCartCalculations(makeCart(3), 0));
    expect(result.current.totalPrices).toBe(150);
  });
});
