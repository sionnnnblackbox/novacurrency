
import { ApiResponse } from '../types';
import { API_BASE_URL } from '../constants';

export async function fetchExchangeRates(baseCurrency: string): Promise<ApiResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/${baseCurrency}`);
    if (!response.ok) {
      throw new Error('Failed to fetch exchange rates');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error in fetchExchangeRates:', error);
    throw error;
  }
}

export function formatCurrency(amount: number, currencyCode: string): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currencyCode,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}
