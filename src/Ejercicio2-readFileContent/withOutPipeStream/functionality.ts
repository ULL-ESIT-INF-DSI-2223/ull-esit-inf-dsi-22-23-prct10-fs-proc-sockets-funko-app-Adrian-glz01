import * as chalk from 'chalk';
import {spawn} from 'child_process';

/**
 * @description Función que ejecuta el comando wc para contar líneas, palabras o caracteres de un fichero
 * @param file 
 * @param lines 
 * @param words 
 * @param chars 
 */
export function run(file: string, lines: boolean, words: boolean, chars:boolean): void {
  // Al menos debe existir una de las opciones que se pasan por parámetro
  // Controlamos que almenos un valor es true, por ende, si todas son false, emitimos mensaje de error y cerramos
  if (!lines && !words && !chars) {
    console.log(chalk.red('Error: Al menos debe existir una de las opciones que se pasan por parámetro'));
    process.exit(0);
  }

  const wc = spawn('wc', [file]);
  let wcOutput = '';
  wc.stdout.on('data', (piece) => wcOutput += piece);

  wc.on('close', () => {
    const wcOutputAsArray = wcOutput.split(/\s+/);
    if (lines) {
      const numberOfLines = +wcOutputAsArray[1] + 1 ;
      console.log(`File ${file} has ` + numberOfLines + ` lines`);
    } 
    if (words) {
      console.log(`File ${file} has ${wcOutputAsArray[2]} words`);
    } 
    if (chars) {
      console.log(`File ${file} has ${wcOutputAsArray[3]} characters`);
    }
  });
}
