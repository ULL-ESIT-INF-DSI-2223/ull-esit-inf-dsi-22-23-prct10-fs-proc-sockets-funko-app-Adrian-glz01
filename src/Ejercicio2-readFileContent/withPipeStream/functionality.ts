import * as fs from 'fs';
import * as chalk from 'chalk';
import { spawn } from 'child_process';
// import { StringDecoder } from 'string_decoder';
import { pipeline } from 'stream';


export function run(path: string, lines: boolean, words: boolean, chars:boolean): void {
  const args = [];
  if (lines) {
    args.push('-l');
  } else if (words) {
    args.push('-w');
  } else if (chars) {
    args.push('-m');
  }

  const wc = spawn('wc', args);

  const text_from_file = fs.createReadStream(path);
  console.log(text_from_file)
  //const utf8 = new StringDecoder('utf8');

  // creamos el pipe

  pipeline(
    text_from_file,
    wc.stdin,
    (err) => {
      if (err) {
        console.log(chalk.red.bold('Error encontrado en el pipeline!!!', err));
        process.exit(0);
      } else {
        wc.stdout.on('data', (data) => {
        console.log(data.toString());
        // console.log("entra aqui")
        // const counter_lines = data.toString().trim().split(/\s+/);
        if (lines) {
          const lines = data.toString().split('\n').length;
          console.log(chalk.green.bold('Lines: ', lines));
        }
        if (words) {
          const words = data.toString().split(/\s+/).length;
          console.log(chalk.green.bold('Words: ', words));
        }
        if (chars) {
          const chars = data.toString().length;
          console.log(chalk.green.bold('Chars: ', chars));
        }
        });
      }
    }
  );
}
