/*
 * cd shop demo program
 *
 * hidekuno@gmail.com
 *
 */
import {generateUUID, formatDate, getNow, makeStock, calcCartQty, dollar, toMusicItem, initMusicItem} from '../utils';
import {MusicItem, CartItem, MusicItemResponse} from '../types';

describe('utils unit tests', () => {
  describe('generateUUID', () => {
    const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;

    test('returns a valid UUID using crypto.randomUUID', () => {
      const uuid = generateUUID();
      expect(uuid).toMatch(UUID_PATTERN);
    });

    test('falls back when crypto.randomUUID is unavailable', () => {
      const original = crypto.randomUUID;
      // @ts-expect-error testing fallback path
      crypto.randomUUID = undefined;
      const uuid = generateUUID();
      expect(uuid).toMatch(UUID_PATTERN);
      crypto.randomUUID = original;
    });
  });

  describe('formatDate', () => {
    test('formats a Date object with zero-padded values', () => {
      const d = new Date(2023, 0, 5, 8, 3, 7);
      expect(formatDate(d)).toBe('2023-01-05 08:03:07');
    });

    test('formats a date string', () => {
      const result = formatDate('2024-12-25T15:30:45');
      expect(result).toMatch(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/);
    });

    test('pads single-digit minutes and seconds', () => {
      const d = new Date(2023, 5, 1, 0, 1, 9);
      const result = formatDate(d);
      expect(result).toBe('2023-06-01 00:01:09');
    });
  });

  describe('getNow', () => {
    test('returns a formatted datetime string', () => {
      const result = getNow();
      expect(result).toMatch(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/);
    });
  });

  describe('makeStock', () => {
    const items: MusicItem[] = [
      {id: 1, title: 'A', artist: 'X', imageUrl: '', description: '', price: 10, stock: 5, digital: false},
      {id: 2, title: 'B', artist: 'Y', imageUrl: '', description: '', price: 20, stock: 3, digital: false},
    ];

    test('returns items unchanged when cart is empty', () => {
      const result = makeStock(items, [], []);
      expect(result[0].stock).toBe(5);
      expect(result[1].stock).toBe(3);
    });

    test('deducts single cart item quantity', () => {
      const cart: CartItem[] = [{item: items[0], qty: 2}];
      const result = makeStock(items, [], cart);
      expect(result[0].stock).toBe(3);
      expect(result[1].stock).toBe(3);
    });

    test('deducts multiple cart items', () => {
      const cart: CartItem[] = [
        {item: items[0], qty: 1},
        {item: items[1], qty: 2},
      ];
      const result = makeStock(items, [], cart);
      expect(result[0].stock).toBe(4);
      expect(result[1].stock).toBe(1);
    });

    test('handles item not in cart (deductedStock defaults to 0)', () => {
      const cart: CartItem[] = [{item: items[0], qty: 1}];
      const result = makeStock(items, [], cart);
      expect(result[1].stock).toBe(3);
    });

    test('returns empty array when jsonData is empty', () => {
      expect(makeStock([], [], [])).toEqual([]);
    });
  });

  describe('calcCartQty', () => {
    test('returns 0 for empty cart', () => {
      expect(calcCartQty([])).toBe(0);
    });

    test('sums all item quantities', () => {
      const item: MusicItem = {id: 1, title: '', artist: '', imageUrl: '', description: '', price: 0, stock: 0, digital: false};
      const cart: CartItem[] = [{item, qty: 3}, {item, qty: 2}];
      expect(calcCartQty(cart)).toBe(5);
    });
  });

  describe('dollar', () => {
    test('prepends dollar sign to number', () => {
      expect(dollar(100)).toBe('$100');
      expect(dollar(0)).toBe('$0');
      expect(dollar(9999)).toBe('$9999');
    });
  });

  describe('toMusicItem', () => {
    const response: MusicItemResponse = {
      id: 1,
      title: 'Revolver',
      artist: 'The Beatles',
      image_url: 'http://example.com/img.jpg',
      description: 'Classic album',
      price: 25,
      stock: 10,
      digital: false,
    };

    test('maps image_url to imageUrl', () => {
      const item = toMusicItem(response);
      expect(item.imageUrl).toBe('http://example.com/img.jpg');
    });

    test('copies all other fields correctly', () => {
      const item = toMusicItem(response);
      expect(item.id).toBe(1);
      expect(item.title).toBe('Revolver');
      expect(item.artist).toBe('The Beatles');
      expect(item.price).toBe(25);
      expect(item.stock).toBe(10);
      expect(item.digital).toBe(false);
    });
  });

  describe('initMusicItem', () => {
    test('returns an empty MusicItem', () => {
      const item = initMusicItem();
      expect(item.id).toBe(0);
      expect(item.title).toBe('');
      expect(item.artist).toBe('');
      expect(item.imageUrl).toBe('');
      expect(item.price).toBe(0);
      expect(item.stock).toBe(0);
      expect(item.digital).toBe(false);
    });
  });
});
