import * as chalk from 'chalk';
import { spawn } from 'child_process';

/**
 * @description Ejecuta el comando wc con las opciones que se pasan por parámetro haciendo uso del método pipe
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

  const stdoutArr: string[] = [];

  if (lines) {
    stdoutArr.push('-l');
  } 
  if (words) {
    stdoutArr.push('-w');
  }
  if (chars) {
    stdoutArr.push('-m');
  }
  stdoutArr.push(file);

  const wc = spawn('wc', stdoutArr);
  wc.stdout.pipe(process.stdout);
}
