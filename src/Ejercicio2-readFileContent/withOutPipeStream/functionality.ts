import * as fs from 'fs';
import * as chalk from 'chalk';
import * as readline from 'readline';

export function run(path: string, lines: boolean, words: boolean, chars:boolean): void {
  // Al menos debe existir una de las opciones que se pasan por parámetro
  // Controlamos que almenos un valor es true, por ende, si todas son false, emitimos mensaje de error y cerramos
  if (!lines && !words && !chars) {
    console.log(chalk.red('Error: Al menos debe existir una de las opciones que se pasan por parámetro'));
    process.exit(0);
  }

  // creamos el stream de lectura del archivo

  const inputFileTextStream = fs.createReadStream(path);
  // MAnejo de errores siguiendo una programación defensiva
  inputFileTextStream.on('error', (err) => {
    console.log(chalk.red('Error leyendo el fichero: ${path}' + err.message));
    process.exit(0);
  });

  // lectura de las lineas del fichero
  const lineRead = readline.createInterface(inputFileTextStream);
  // Manejo de errores siguiendo una programación defensiva
  lineRead.on('error', (err) => {
    console.log(chalk.red('Error leyendo el fichero: ${path} ' + err.message));
    process.exit(0);
  });

  let linesNumber = 0;
  let wordsNumber = 0;
  let charsNumber = 0;

  lineRead.on('line', (line:string) => { 
    linesNumber++; // increamentamos el numero de lineas
    if (words) {
      wordsNumber += line.split(' ').length; // incrementamos el numero de palabras atendiendo a cada palabra separada por un espacio
    }
    if (chars) {
      charsNumber += line.length; // incrementamos el numero de caracteres atendiendo a cada caracter de la linea
    }
  });

  lineRead.on('close', () => {
    // inputFileTextStream.close();

    //* mostramos los resultados
    if (lines) {
      console.log(chalk.green('Número de líneas: ') + linesNumber);
    }
    if (words) {
      console.log(chalk.green('Número de palabras: ') + wordsNumber);
    }
    if (chars) {
      console.log(chalk.green('Número de caracteres: ') + charsNumber);
    }
  });
}
