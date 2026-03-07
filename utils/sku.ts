
import { Product } from '../types';

export const generateSKU = (existingProducts: Product[]): string => {
  const existingSKUs = new Set(existingProducts.map(p => p.sku));
  let sku = '';
  do {
    sku = Math.floor(1000000 + Math.random() * 9000000).toString();
  } while (existingSKUs.has(sku));
  return sku;
};
