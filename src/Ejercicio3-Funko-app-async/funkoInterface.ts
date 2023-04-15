import { Funko_type } from './types';
import { Funko_genre } from './types';

/**
 * @description Funko interface
 * @interface Funko
 * @property {number} _id - Funko id
 * @property {string} _name - Funko name
 * @property {string} _description - Funko description
 * @property {Funko_type} _type - Funko type
 * @property {Funko_genre} _genre - Funko genre
 * @property {string} _franchise - Funko franchise
 * @property {number} _franchise_number - Funko franchise number
 * @property {boolean} _exclusive - Funko exclusive
 * @property {string} _especialCaracteristics - Funko especial Caracteristics
 * @property {number} _price - Funko price
 */
export interface Funko {
  _id?: number;
  _name?: string;
  _description?: string;
  _type?: Funko_type;
  _genre?: Funko_genre;
  _franchise?: string;
  _franchise_number?: number;
  _exclusive?: boolean;
  _especialCaracteristics?: string;
  _price?: number;
}