// import * as net from "net";
import * as yargs from "yargs";
import { hideBin } from 'yargs/helpers';
import {RequestType, Funko_type, Funko_genre} from './types';
import {Funko} from './funkoInterface';
import {MessageEventEmitterClient} from './eventEmitterClient';
import * as chalk from 'chalk';


let jsonData: Funko;
let request: RequestType;

/**
 * @description Comando para añadir un Funko
*/
yargs(hideBin(process.argv))
.command('add', 'Adds a funko', {
  user: {
      description: 'User name',
      type: 'string',
      demandOption: true, // obligatorio
    },
    id: {
      description: 'Funko id',
      type: 'number',
      demandOption: true,
    },
    name: {
      description: 'Funko name',
      type: 'string',
      demandOption: true,
    },
    description: {
      description: 'Funko description',
      type: 'string',
      demandOption: true,
    },
    type: {
      description: 'Funko type',
      type: 'string',
      demandOption: true,
    },
    genre: {
      description: 'Funko genre',
      type: 'string',
      demandOption: true,
    },
    franchise: {
      description: 'Funko franchise',
      type: 'string',
      demandOption: true,
    },
    franchise_number: {
      description: 'Funko franchise number',
      type: 'number',
      demandOption: true,
    },
    exclusive: {
      description: 'Funko exclusive',
      type: 'boolean',
      demandOption: true,
    },
    espCar: {
      description: 'Funko especial Caracteristics',
      type: 'string',
      demandOption: true,
    },
    price: {
      description: 'Funko price',
      type: 'number',
      demandOption: true,
    }
  }, (argv) => {
    jsonData = {
      _id: argv.id,
      _name: argv.name,
      _description: argv.description,
      _type: argv.type as Funko_type,
      _genre: argv.genre as Funko_genre,
      _franchise: argv.franchise,
      _franchise_number: argv.franchise_number,
      _exclusive: argv.exclusive,
      _especialCaracteristics: argv.espCar,
      _price: argv.price
    }
    request = {
      type: 'add',
      user: argv.user,
      message: jsonData
    }
  }).help().argv

  /**
   * @description Comando para actualizar el contenido de un Funko
   */
yargs(hideBin(process.argv))
  .command('update', 'Modify funko content', {
    user: {
      description: 'User name',
      type: 'string',
      demandOption: true, // obligatorio
    },
    id: {
      description: 'Funko id',
      type: 'number',
      demandOption: true,
    },
    name: {
      description: 'Funko name',
      type: 'string',
      demandOption: true,
    },
    description: {
      description: 'Funko description',
      type: 'string',
      demandOption: true,
    },
    type: {
      description: 'Funko type',
      type: 'string',
      demandOption: true,
    },
    genre: {
      description: 'Funko genre',
      type: 'string',
      demandOption: true,
    },
    franchise: {
      description: 'Funko franchise',
      type: 'string',
      demandOption: true,
    },
    franchise_number: {
      description: 'Funko franchise number',
      type: 'number',
      demandOption: true,
    },
    exclusive: {
      description: 'Funko exclusive',
      type: 'boolean',
      demandOption: true,
    },
    espCar: {
      description: 'Funko especial Caracteristics',
      type: 'string',
      demandOption: true,
    },
    price: {
      description: 'Funko price',
      type: 'number',
      demandOption: true,
    }
  }, (argv) => {
    jsonData = {
      _id: argv.id,
      _name: argv.name,
      _description: argv.description,
      _type: argv.type as Funko_type,
      _genre: argv.genre as Funko_genre,
      _franchise: argv.franchise,
      _franchise_number: argv.franchise_number,
      _exclusive: argv.exclusive,
      _especialCaracteristics: argv.espCar,
      _price: argv.price
    }
    request = {
      type: 'update',
      user: argv.user,
      message: jsonData
    }
  }).help().argv

/**
 * @description Comando para eliminar un Funko
 */
yargs(hideBin(process.argv))
  .command('remove', 'Remove a funko from an user collection', { 
    user: {
      description: 'User name',
      type: 'string',
      demandOption: true,
    },
    id: {
      description: 'Funko id',
      type: 'number',
      demandOption: true,
    }
  }, (argv)=> {
    jsonData = {
      _id: argv.id,
    }
    request = {
      type: 'remove',
      user: argv.user,
      message: jsonData
    }
  }).help().argv

/**
 * @description Comando para listar todos los Funkos de un usuario
 */
yargs(hideBin(process.argv))
  .command('list', 'List all funkos', {
    user: {
      description: 'User name',
      type: 'string',
      demandOption: true, // obligatorio
    }
  }, (argv) => {
    jsonData = {}
    request = {
      type: 'list',
      user: argv.user,
      message: jsonData
    }
  }).help().argv

/**
 * @description Comando para mostrar el contenido de un funko en concreto
 */
yargs(hideBin(process.argv))
  .command('read', 'Find a funko in user folder by ID.', {
    user: {
      description: 'User name',
      type: 'string',
      demandOption: true,
    },
    id: {
      description: 'Funko id',
      type: 'number',
      demandOption: true,
    }
  }, (argv) => {
    jsonData = {
      _id: argv.id,
    }
    request = {
      type: 'read',
      user: argv.user,
      message: jsonData
    }
  }).help().argv

// Desarrollamos todo el cliente

const client = new MessageEventEmitterClient(8002);
// console.log("REQUEST: " + JSON.stringify(request));

client.on('connect', () => {
  // console.log('Conexión establecida con el servidor');
  client.sendMessage(request);
});

client.on('message', (message) => {
  const response = JSON.parse(message);
  switch (response.type) {
    case 'add':
      if (response.success) {
        console.log(chalk.green.bold(response.message));
      } else { 
        console.log(chalk.red.bold(response.message));
      }
      break;
    case 'update':
      if (response.success) {
        console.log(chalk.green.bold(response.message));
      } else {
        console.log(chalk.red.bold(response.message));
      }
      break;
    case 'remove':
      if (response.success) {
        console.log(chalk.green.bold(response.message));
      } else {
        console.log(chalk.red.bold(response.message));
      }
      break;
    case 'list':
      if (response.success) {
        console.log(chalk.green.bold(response.message));
        let counter = 0;
        for (const funko of response.funkoPops as Funko[]) {
          if (counter % 2 == 0) {
            console.log(chalk.gray.bold(JSON.stringify(funko)));
          } else {
            console.log(chalk.yellow.bold(JSON.stringify(funko)));
          }
          //console.log('\n');
          counter++;
        }
      } else {
        console.log(chalk.red.bold(response.message));
      }
      break;
    case 'read':
      if (response.success) {
        console.log(chalk.green.bold(response.message));
        const funko = response.funko as Funko;
        console.log(chalk.green.bold(JSON.stringify(funko)));
      } else {
        console.log(chalk.red.bold(response.message));
      }
      break;
    case 'error':
      console.error(chalk.red.bold(response.message));
      break;
  }
  client.disconnect();
});

client.on('disconnect', () => {
  console.log(chalk.cyan.bold('Se ha desconectado del servidor'));
});

client.on('error', (err) => {
  console.error(`Error de conexión: ${err.message}`);
});