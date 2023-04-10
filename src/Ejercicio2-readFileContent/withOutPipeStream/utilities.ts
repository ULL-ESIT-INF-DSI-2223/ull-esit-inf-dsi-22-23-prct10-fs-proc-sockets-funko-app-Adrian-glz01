import * as fs from 'fs';

/**
 * @description Funcion que comprueba si un archivo existe
 * @param filePath -- Ruta del archivo
 */
export function checkFileExistsSync(filePath: string): boolean {
  try {
    fs.accessSync(filePath);
    return true;
  } catch (error) {
    return false;
  }
}