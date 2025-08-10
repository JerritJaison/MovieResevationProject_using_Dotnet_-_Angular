export interface IScreen {
  screenId: number;
  theaterId: number;
  screenName: string;
  totalSeats: number;
  type: string;  // e.g., 2D, IMAX, 3D
}
