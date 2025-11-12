export interface Conference {
  id?: number;
  titre: string;
  type: string;
  date: Date;
  duree: number;
  nbInscrits: number;
  score: number;
  keynoteIds: number[];
}

export interface ConferenceDTO {
  id?: number;
  titre: string;
  type: string;
  date: Date;
  duree: number;
  nbInscrits: number;
  score: number;
  keynoteIds: number[];
}

export interface Review {
  id?: number;
  date: Date;
  texte: string;
  stars: number;
  conferenceId?: number;
}
