export interface Review {
  id?: number;
  date: Date;
  texte: string;
  stars: number;
  conferenceId?: number;
}
