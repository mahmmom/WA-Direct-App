export interface CountryCode {
  name: string;
  dial_code: string;
  code: string;
}

export interface HistoryItem {
  id: string;
  phoneNumber: string;
  countryCode: string;
  timestamp: number;
  note?: string; // Optional message draft used
}

export enum SendingStatus {
  IDLE = 'IDLE',
  GENERATING = 'GENERATING',
  READY = 'READY',
}