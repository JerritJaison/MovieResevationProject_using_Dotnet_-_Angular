import { IMovie } from "./IMovie";

export interface Show {
  showId: number;
  movieId: number;
  screenId: number;
  theaterId: number;
  startTime: string;
  showDate: string;
  ticketPrice: number;
  movie?: IMovie;
  screen?: {
    screenId: number;
    screenName: string;
  };
  theater?: {
    theaterId: number;
    name: string; // <-- updated here based on actual API response
  };
}
