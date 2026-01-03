
export interface Currency {
  code: string;
  name: string;
  flag: string;
}

export interface ExchangeRates {
  [key: string]: number;
}

export interface ApiResponse {
  result: string;
  base_code: string;
  rates: ExchangeRates;
  time_last_update_unix: number;
}

// Interface for tracking currency conversion records in the activity log
export interface ConversionHistory {
  id: string;
  from: string;
  to: string;
  fromAmount: number;
  toAmount: number;
  timestamp: number;
}
