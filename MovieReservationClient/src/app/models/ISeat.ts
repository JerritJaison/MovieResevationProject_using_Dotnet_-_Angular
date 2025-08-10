export interface ISeat {
  seatId: number;
  seatNumber: string;
  isBooked: boolean;
  price: number;
  isSelected?: boolean; // UI-only property
  row?: string;         // e.g., "A"
}