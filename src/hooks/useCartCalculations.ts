import {useState, useMemo} from 'react';
import {CartItem} from '../types';

export const useCartCalculations = (cartItems: CartItem[], userPoint: number) => {
  const [checked, setChecked] = useState(false);

  const totalPrices = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + item.item.price * item.qty, 0);
  }, [cartItems]);

  const calcTotalPayment = (usePoints: boolean = checked): number => {
    const result = usePoints ? totalPrices - userPoint : totalPrices;
    return result < 0 ? 0 : result;
  };

  const calcRemainingPoint = (usePoints: boolean = checked): number => {
    const result = usePoints ? userPoint - totalPrices : userPoint;
    return result < 0 ? 0 : result;
  };

  const calcEarnedPoint = (usePoints: boolean = checked): number => {
    if (usePoints) {
      return 0;
    }
    return Math.floor(totalPrices / 10);
  };

  return {
    checked,
    setChecked,
    totalPrices,
    calcTotalPayment,
    calcRemainingPoint,
    calcEarnedPoint
  };
};
