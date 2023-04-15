import {Funko} from './funkoInterface';
/**
 * @description Funko types
 */
export enum Funko_type {
  POP = "POP!",
  POP_RIDES = "POP! Rides",
  VYNIL_SODA = "Vynil Soda",
  VYNIL_GOLD = "Vynil Gold",
}

/**
 * @description Funko genres
 */
export enum Funko_genre {
  ANIME = "Anime",
  FILM_TV = "Film & TV",
  VIDEOGAME = "Video Games",
  SPORT = "Sport",
  MUSIC = "Music",
}

/**
 * @description Request type
 *
 */
export type RequestType = {
  type: 'add' | 'update' | 'remove' | 'read' | 'list';
  user: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  message: Funko;
}

/**
 * @description Response type
 */
export type ResponseType = {
  type: 'add' | 'update' | 'remove' | 'read' | 'list' | 'error';
  success: boolean;
  message: string;
  funko?: Funko;
  funkoPops?: Funko[];
}