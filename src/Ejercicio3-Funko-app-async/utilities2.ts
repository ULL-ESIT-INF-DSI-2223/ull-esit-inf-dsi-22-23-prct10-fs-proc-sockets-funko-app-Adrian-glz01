import * as fs from 'fs';

/**
 * @description Función que comprueba si el id del funko es unico
 * @param path -- Path donde se va a crear el funko
 */
export function getIds(path:string): number[] {
    const files = fs.readdirSync(path).filter((file) => file.endsWith('.json')); // nos aseguramos que los ficheros leidos son solo los .json, para curarme en salud
    const ids: number[] = []; // array donde almacenaremos los ids de los funkos del usuario
  
    files.forEach((file) => {
      const content = fs.readFileSync(`${path}/${file}`);
      const funkoData = JSON.parse(content.toString());
      // console.log(funkoData.id);
      ids.push(funkoData.id);
    });
  
    // console.log(ids);
    return ids;
  }