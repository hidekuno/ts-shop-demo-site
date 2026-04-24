import {MusicItem, OrderItem, CartItem, MusicItemResponse} from './types';

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
export const formatDate = (date: string | Date): string => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  const seconds = String(d.getSeconds()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

export const getNow = (): string => {
  return formatDate(new Date());
};

export const makeStock = (jsonData: MusicItem[], order: OrderItem[], cart: CartItem[]) => {
  const stockMap = new Map<number, number>();

  const updateStockMap = (id: number, qty: number) => {
    stockMap.set(id, (stockMap.get(id) || 0) + qty);
  };

  for (const cartItem of cart) {
    updateStockMap(cartItem.item.id, cartItem.qty);
  }

  return jsonData.map((musicItem: MusicItem) => {
    const deductedStock = stockMap.get(musicItem.id) || 0;
    return {...musicItem, stock: musicItem.stock - deductedStock};
  });
};

export const calcCartQty = (cart: CartItem[]) => cart.reduce((sum, current) => sum + current.qty, 0);

export const dollar = (n: number): string => '$' + n;

export const toMusicItem = (item: MusicItemResponse): MusicItem => ({
  id: item.id,
  title: item.title,
  artist: item.artist,
  imageUrl: item.image_url,
  description: item.description,
  price: item.price,
  stock: item.stock,
  digital: item.digital,
});

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
