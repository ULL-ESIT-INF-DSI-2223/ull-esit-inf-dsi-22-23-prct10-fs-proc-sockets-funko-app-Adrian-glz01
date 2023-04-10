import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

import {checkFileExistsSync} from './utilities';
import { run } from './functionality';

import * as chalk from "chalk";
import { exit } from 'process';
 
yargs(hideBin(process.argv))
.command('read', 'Reads a file', {
  file: {
    description: 'File path',
    type: 'string',
    demandOption: true,
  },
  lines: {
    description: 'File lines',
    type: 'boolean',
    demandOption: true,
  },
  words: {
    description: 'File words',
    type: 'boolean',
    demandOption: true,
  },
  chars: {
    description: 'File chars',
    type: 'boolean',
    demandOption: true,
  }
} , (argv) => {
  if (checkFileExistsSync(argv.file)) {
    // console.log('File exists');
    run(argv.file, argv.lines, argv.words, argv.chars);
  } else {
    console.log(chalk.red.bold('File does not exist, please try again'));
    exit(0)
  }
})
.help()
.argv;