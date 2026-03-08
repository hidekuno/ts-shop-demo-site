import {MusicItem, OrderItem, CartItem} from './types';

// ID Generator with fallback
export const generateUUID = (): string => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  // Fallback for environments where crypto.randomUUID is not available
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

// Date Formatter
export const getNow = (): string => {
  const d = new Date();
  return d.toLocaleDateString('sv-SE') + ' ' + d.toLocaleTimeString('sv-SE');
};

export const makeStock = (jsonData: MusicItem[], order: OrderItem[], cart: CartItem[]) => {
  const stockMap = new Map<number, number>();

  const updateStockMap = (id: number, qty: number) => {
    stockMap.set(id, (stockMap.get(id) || 0) + qty);
  };

  for (const orderItem of order) {
    for (const detailItem of orderItem.detail) {
      updateStockMap(detailItem.item.id, detailItem.qty);
    }
  }
  for (const cartItem of cart) {
    updateStockMap(cartItem.item.id, cartItem.qty);
  }

  return jsonData.map((musicItem: MusicItem) => {
    const deductedStock = stockMap.get(musicItem.id) || 0;
    return {...musicItem, stock: musicItem.stock - deductedStock};
  });
};

export const calcCartQty = (cart: CartItem[]) => cart.reduce((sum, current) => sum + current.qty, 0);

export const initMusicItem = (): MusicItem => ({
  id: 0,
  title: '',
  artist: '',
  imageUrl: '',
  description: '',
  price: 0,
  stock: 0,
  digital: false
});
