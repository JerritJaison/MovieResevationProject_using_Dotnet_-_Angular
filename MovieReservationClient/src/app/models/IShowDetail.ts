// show-details.model.ts
export interface IShowDetail {
  showId: number;
  theaterName: string;
  screenType: string;
  showDate: string;   // or Date
  showTime: string;   // or Time string
  price: number;
}
