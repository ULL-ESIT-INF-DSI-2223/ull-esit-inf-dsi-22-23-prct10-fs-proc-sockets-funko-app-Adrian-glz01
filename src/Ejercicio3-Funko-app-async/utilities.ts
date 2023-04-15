/**
 * Fichero donde se alojaran funciones de utilidad para la aplicación
*/

import * as fs from 'fs';
import { spawn } from 'child_process';
import * as chalk from 'chalk';
import { Funko } from './funkoInterface';
import {getIds} from './utilities2';

/**
 * @description Función que comprueba si un usuario existe en la base de datos
 * @description Haciendo uso de lo aprendido en el ejercicio 1 de esta práctica
 * @param filePath 
 * @param callback 
 */
export function userExistOnBD(filePath: string, callback: (exists: boolean) => void): void {
  fs.access(filePath, fs.constants.F_OK, (err) => {
  if (err) {
    callback(false);
  } else {
    callback(true);
  }
  });
}

/**
 * Función asíncrona que crea un directorio en la ruta especificada
 * @param directoryName 
 */
export function createDirectory(directoryName: string): void {
  const directoryPath = `./database/${directoryName}`;
  const mkdir = spawn('mkdir', [directoryPath]);

  mkdir.on('close', (code) => {
    if (code === 0) {
      console.log(chalk.yellow.bold(`Directorio ${directoryPath} creado exitosamente.`));
    } else {
      console.error(chalk.red.bold(`ERROR!! Al crear el directorio ${directoryPath}. Código de salida: ${code}`));
    }
  });
}

/**
 * @description Función que genera un fichero JSON con la información del funko
 * @param funko 
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function createJsonFunkoFile(user:string, funko: Funko): void {
  const datosJSON = JSON.stringify(funko);
  // creamos el path donde se va a crear el fichero con el nombre del funko y extension .json
  const newPath = `./database/${user}/${funko._name}.json`; 

  fs.writeFileSync(newPath, datosJSON);
}

/**
 * @Description Funcion que verifica si existe un directorio con el nombre del usuario en la base de datos
 * @param userNAme -- Nombre del usuario
 * @param path -- Path donde se va a buscar el directorio
 */
export function checkUserDirSync(userName: string, path: string) : boolean {
  // Leemos el directorio y almacenamos en una variable los archivos dentro de ella
  //? Tener en cuenta que pueden ser carpetas o archivos, para no olvidarme de manejar esto despues... 
  const pathDirectories = fs.readdirSync(path); 

  // variable booleana para retornar si existe o no el directorio
  //? lstatSync Mediante esta funcion podemos saber si es un directorio o un archivo, en caso de ser un archivo se retornara false
  const existDir = pathDirectories.some((dir) => dir === userName && fs.lstatSync(`${path}/${dir}`).isDirectory()) 

  return existDir;
}

/**
 * @description Función que borra un funko por su id
 * @param path -- Path donde se va a crear el funko
 * @param user -- Usuario que crea el funko
 * @param id -- Id del funko
 * 
 */
export function removeFunko(path: string, user: string, id: number): boolean{
  const newPath = `${path}/${user}`;
  const ids = getIds(newPath);

  if (ids.includes(id)) {
    const files = fs.readdirSync(newPath).filter((file) => file.endsWith('.json'));
    files.forEach((file) => {
      const data = fs.readFileSync(`${newPath}/${file}`, 'utf-8');
      const jsonData = JSON.parse(data);

      if (jsonData.id === id) {
        // console.log("Entra aqui")
        const newpath_and_file = `${newPath}/${file}`;
        fs.unlinkSync(newpath_and_file);
      }
    });
    // console.log("Funko eliminado correctamente");
    return true;
  } else {
    return false;
  }
}

/**
 * Función que lista los funkos de un usuario
 * @param path -- Path donde se va a crear el funko
 * @param user -- Usuario que crea el funko
 */
export function listFunko(path: string, user: string): Funko[] {
  const newPath = `${path}/${user}`;
  const files = fs.readdirSync(newPath).filter((file) => file.endsWith('.json'));

  const funkos: Funko[] = [];
  files.forEach((file) => {
    const data = fs.readFileSync(`${newPath}/${file}`, 'utf-8');
    const jsonData = JSON.parse(data);
    funkos.push(jsonData);
  });
  return funkos;
}

/**
 * @description Función que busca un funko por su id
 * @param path -- Path donde se va a crear el funko
 * @param user -- Usuario que crea el funko
 * @param id -- Id del funko
 */
export function findFunkoByID(path: string, user: string, id: number): Funko {
  const newPath = `${path}/${user}`;
  let funko: Funko = {
    _description: 'ERROR',
  }

  const files = fs.readdirSync(newPath).filter((file) => file.endsWith('.json'));
    files.forEach((file) => {
      const data = fs.readFileSync(`${newPath}/${file}`, 'utf-8');
      const jsonData = JSON.parse(data);

      if (jsonData.id === id) {
        funko = jsonData;
      }
  });
  return funko;
}