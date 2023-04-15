[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-24ddc0f5d75046c5622901739e7c5dd533143b0c8e959d652212380cedb1ea36.svg)](https://classroom.github.com/a/NApXvVde)

# Informe 

[![Coverage Status](https://coveralls.io/repos/github/ULL-ESIT-INF-DSI-2223/ull-esit-inf-dsi-22-23-prct10-fs-proc-sockets-funko-app-Adrian-glz01/badge.svg?branch=main)](https://coveralls.io/github/ULL-ESIT-INF-DSI-2223/ull-esit-inf-dsi-22-23-prct10-fs-proc-sockets-funko-app-Adrian-glz01?branch=main)

En esta decima práctica se pondrán en práctica los conceptos aprendidos en la clase de teoría sobre Sockets, creación de procesos y sobre los conceptos _'pila de llamada'_ , '_cola de manejadores'_ y _'bucle de eventos'_

Asimismo, se seguirán ampliando los conocimientos sobre el lenguaje de programación javascript y del framework Node.js.

## Índice

1. Ejercicios 
    - 1.1. [Ejercicio 1.](#ejercicio-1)
    - 1.2. [Ejercicio 2. - Read file content](#ejercicio-2)
    - 1.3. [Ejercicio 3. - FunkoPop app](#ejercicio-3)
2. [Dificultades/Reflexión.](#__dificultadesreflexión)
3. [Referencias](#referencias)

## Problemas práctica 10.

### __Ejercicio 1:__ 

Se ha solicitado entender, ejecutar y trazar el siguiente fragmento de código:

```ts 
import * as fs from 'fs';

if (process.argv.length !== 3) {
  console.log('Please, specify a file');
} else {
  const filename = process.argv[2];

  fs.access(filename, fs.constants.F_OK, (err) => {
    if (err) {
      console.log(`File ${filename} does not exist`);
    } else {
      console.log(`Starting to watch file ${filename}`);

      const watcher = fs.watch(process.argv[2]);

      watcher.on('change', () => {
        console.log(`File ${filename} has been modified somehow`);
      });

      console.log(`File ${filename} is no longer watched`);
    }
  });
}
```

Con el objetivo de explicar durante la traza que suecede con el contenido de la pila de llamadas, el registro de eventos de la API y la cola de manejadores. Además se pide realizar dos modificaciones al fichero que se le pasa a la función y mostrar el contenido impreso en consola.

#### Explicación del código

Entendiendo el código lo esperado es que si se ha indicado correctamente el fichero que se va a analizar, primero se muestre el mensaje

```ts
`File ${filename} does not exist`
```

Tras esto, lo esperado es que se espere una modificacion en el fichero y tras cada modificacion se notifique por consola de ello y finalmente mostrar el mensaje 

```ts
`File ${filename} is no longer watched`
```

Sin embargo, la realidad es muy diferente, atendiendo a que la impresión por consola del mensaje final es síncrono y el _fs.watcher_ es asíncrono, mientras este segundo espera un cambio en el fichero se esta procesando en la call stack el _console log_ del mensaje final. Por lo que el funcionamiento del programa no es el deseado, una vez procesado el primer _console log_ en el web api se queda esperando a cambios en el fichero, mientras que el texto final ya ha sido ejecutado.

#### Ejecución del código

Se ha ejecutado el código y se han llevado a cabo dos modificaciones del fichero _'helloworld.txt'_ el cual se ha pasado como argumento al programa. El resultado ha sido el siguiente:

```console
$node ./dist/Ejercicio1-debug/readfile.js helloworld.txt 
Starting to watch file helloworld.txt
File helloworld.txt is no longer watched
File helloworld.txt has been modified somehow
File helloworld.txt has been modified somehow
File helloworld.txt has been modified somehow
File helloworld.txt has been modified somehow
File helloworld.txt has been modified somehow
```

#### Función _fs.acces()_

El método access se usa para comprobar los permisos de un archivo o directorio. Estos permisos se pueden especificar mediante una constante (_'constant'_) pasada como segundo parámetro. Mencionar que pueden concatenarse varios permisos mediante el operador _OR_ lógico.

En cuanto a la sintaxis del método podemos ver que se requieren los siguientes parámetros:

```ts
fs.access (path, mode, callback).
```

1. __Path:__ Es la ruta hasta el fichero/directorio que se desea comprobar.

2. __Mode:__ Aquí es donde se emplea el fs.constant.F_OK en nuestro programa, mediante este parámetro se decide que permisos se quieren comprobar, el F_OK es el valor por defecto, pero también hay otros valores como W_OK, R_OK, etc. Y como se mencionó anteriormente pueden ser concatenados mediante el operador lógio _OR_.

3. __Callback:__ Es una funcion llamada durante la ejecucion del método, en nuestro ejemplo se utiliza para comprobar la existencia del fichero que se está examinando. 

### __Ejercicio 2:__ 

Se nos ha solicitado desarrollar una aplicación la cual se encargue de leer el numero de lineas, palabras y carácteres de un fichero.

A esta aplicación se le pasa por parámetro el nombre del fichero a examinar y trees booleanos decidiendo que se desea contar. Para el manejo del los parametros de entrada se ha hecho uso del paquete _[yargs](https://www.npmjs.com/package/yargs)_. Tal como se puede ver a continuación:

``` ts
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
```

#### __Usando el método pipe__ 

Mencionar que antes de llamar a la funcion _run()_ se comprueba si el fichero existe, en caso contrario se emite un mensaje de error en consola.

Asimismo, se nos ha solicitado realizar de dos maneras diferentes esta aplicación, en primer lugar, se nos solicita realizarla haciendo uso del método _pipe_ de un _Stream_. 

Mi propuesta ha sido la siguiente:

```ts
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
```

Tal y como se puede observar por cuestiones de programación defensiva primero se comprueba que los tres parámetros no sean _false_, debido a que si se desea usar la aplicación es para contar uno de los 3 parámetros que lee el comando wc. En caso de que no se supere el filtro se emite un mensaje de error por consola.

Tras este filtro, se genera un array de cadenas en el cual se van a meter los parámetros que se le van a enviar al comando wc. Esto se gestiona mediante tres filtros en los cuales se comprueban tres valores booleanos; _lines_, _words_ y _chars_, y se va concatenando al array de cadenas los parametros que se desean ver.

Finalmente creamos un nuevo proceso mediante _spawn_ que recibe como primer parámetro el nombre del comando a ejecutar y en segundo lugar, un array con los parámetros que se van a examinar y el nombre del fichero que se va a leer. Tras esto tal y como se nos pide redirigimos la salida del proceso mediante el método _pipe_ de un stream.

#### __Sin hacer uso del pipe__ 

En segundo lugar, se solicita desarrollar la misma app pero sin usar el método _pipe_. En su lugar se crea un subproceso y se hace uso de los maneajores 'data' y 'close' para llevar a cabo su ejecución.

Mi propuesta ha sido la siguiente:

```ts
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
```

Primero se realiza la misma comprobación que en el ejemplo anterior.

Luego se genera un subproceso mediante spawn al cual se le pasa como primer parámetro el comando _wc_ y un array con el nombre del fichero que se desea ejecutar.

A continuación, mediante el evento _on.('data')_ almacenamos el resultado del comando en un array de cadenas y finalmente, con el evento _on.('close')_ una vez se ha leido el fichero mostramos por consola el contenido que el usuario desea ver.

### __Ejercicio 3:__ 

Se nos ha solicitado realizar una modificación a la aplicación desarrollada en la práctica anterior. En este caso se debe establecer un patrón petición-respuesta entre cliente y servidor en la cual el cliente se conecta al servidor y le hace un request con un comando, el servidor lo procesa y le devuelve el resultado a este. Ese resultado se procesa y se imprime en consola.

Asimismo toda la lógica de ficheros en el servidor debe llevarse a cabo mediante APIs asíncronas de NODE.js.

Mi propuesta ha sido la siguiente:

#### Cliente:

En la parte del cliente se ha llevado a cabo la recepcion de comandos mediante el uso del paquete yargs, tal y como se puede ver a continuación:

```ts
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
```

Cada comando tiene sus propios argumentos de caracter obligatorio y con estos se construye un objeto json y se forma el request type que se le enviará al servidor.

Tras esto se desarrolla el cliente utilizando la clase MessageEventEmitterClient, que como se puede ver a continuación:

```ts
export class MessageEventEmitterClient extends EventEmitter {
  private socket: net.Socket;

  constructor(private port: number) {
    // console.log("SE HA CREADO LA CLASE CLIENTE");
    super();
    this.connect();
  }

  /**
   * @description Método que conecta el cliente al servidor y establece los eventos
   */
  connect(): void {
    // console.log("SE HA LLAMADO AL METODO CONNECT");
    this.socket = net.connect({port: this.port }, () => {
      console.log('Conexión establecida con el servidor');
      this.emit('connect');
    });

    this.socket.on('data', (data) => {
      this.emit('message', data);
    });

    this.socket.on('close', () => {
      this.emit('disconnect');
    });

    this.socket.on('error', (err) => {
      this.emit('error', err);
    });
  }

  /**
   * @description Método que envía un mensaje al servidor
   * @param message 
   */
  sendMessage(message: RequestType): void {
    if (!this.socket || this.socket.destroyed) {
      throw new Error('El cliente no está conectado al servidor');
    }
    // console.log(JSON.stringify(message));
    const stringMessage = JSON.stringify(message);
    //! SOLVENTAR ERROR DE LA COMPILACION TSC
    if (stringMessage) { // si el mensaje es null o undefined no lo enviamos
      this.socket.write(stringMessage);
    }
  }

  /**
   * @description Método que desconecta el cliente del servidor
   * @description [Doc](https://nodejs.org/api/net.html#socketdestroyed)
   */
  disconnect(): void {
    if (this.socket && !this.socket.destroyed) {
      this.socket.end();
    }
  }
}
```

Es una clase que hereda de la clase _eventEmitter_, sus únicos atributos privados son el socket del módulo net y el puerto que esta escuchando el servidor. Asimismo esta clase tiene 3 métodos. En primer lugar, _connect()_ el cual lleva a cabo la conexión con el servidor y le emite al cliente los eventos que le le lanza el servidor, luego, _sendMessage()_ utilizado para enviarle al servidor un request y por último, _disconnect_ el cual cierra la conexión con el servidor.

Además, comentar el siguiente fragmento de código:

```ts
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
```

En el cual el cliente procesa la respuesta de tipo _response_ que le envía el servidor. Para cada tipo de respuesta que pueda recepcionar el cliente se examina si ha sido satisfactorio en base al parámetro _succes_ de la respuesta, emitiendo la respuesta del servidor en la terminal y un mensaje de error en caso contrario.

#### Servidor:

En cuanto a la parte del servidor se va a comentar el siguiente código:

```ts
let response: ResponseType;

const server = net.createServer((socket) => {
  console.log(chalk.bold.green('Cliente conectado'));

  socket.on('data', (data) => {
    // console.log(`Datos recibidos: ${data}`);
    const request = JSON.parse(data.toString())
    // console.log(request);
    if (request.user) { // comprobamos que el parametro user no es nulo o undefined
      // comprobamos que el usuario existe en la BBDD
      userExistOnBD(`./database/${request.user}`, (exists) => {
        if (exists) {
          const ids = getIds(`./database/${request.user}`);
          // console.log(chalk.green.bold("El usuario existe"));
          switch (request.type) {
            case 'add':
              // comprobamos que el id no existe en la BBDD
              if(ids.includes(request.message._id)) {
                response = {
                  type: 'add',
                  success: false,
                  message: 'El funko con id ' + request.message._id + ' ya existe en la BBDD del usuario ' + request.user 
                }
                const responseString = JSON.stringify(response);
                socket.write(responseString);
              } else {
                createJsonFunkoFile(request.user, request.message);
                response = {
                  type: 'add',
                  success: true,
                  message: 'Se ha añadido correctamente el funko ' + request.message.name + ' al usuario ' + request.user
                }
                const responseString = JSON.stringify(response);
                socket.write(responseString);
              }
              break;
            case 'remove':
              if (checkUserDirSync(request.user, './database')) {
                removeFunko('./database', request.user, request.message._id);
                response = {
                  type: 'remove',
                  success: true,
                  message: 'Se ha borrado correctamente el funko' + request.message._id + ' del usuario ' + request.user
                }
                const responseString = JSON.stringify(response);
                socket.write(responseString);
              } else {
                response = {
                  type: 'remove',
                  success: false,
                  message: 'El usuario no existe'
                }
                const responseString = JSON.stringify(response);
                socket.write(responseString);
              }
              break;
            case 'update':
              if (checkUserDirSync(request.user, './database')) {
                removeFunko('./database', request.user, request.message._id);
                createJsonFunkoFile(request.user, request.message);
                response = {
                  type: 'update',
                  success: true,
                  message: 'Se actualizado correctamente el funko' + request.message._id + ' del usuario ' + request.user
                }
                const responseString = JSON.stringify(response);
                socket.write((responseString));
              } else {
                response = {
                  type: 'update',
                  success: false,
                  message: 'El usuario no existe'
                }
                const responseString = JSON.stringify(response);
                socket.write(responseString);
              }
              break;
            case 'list':
              if (checkUserDirSync(request.user, './database')) {
                const funkos = listFunko('./database', request.user);
                response = {
                  type: 'list',
                  success: true,
                  message: 'Se ha decicido listar los funko',
                  funkoPops: funkos
                }
                const responseString = JSON.stringify(response);
                socket.write(responseString);
              } else {
                response = {
                  type: 'list',
                  success: false,
                  message: 'El usuario no existe'
                }
                const responseString = JSON.stringify(response);
                socket.write((responseString));
              }
              break;
            case 'read':
              if (checkUserDirSync(request.user, './database')) {
                if (ids.includes(request.message._id)) {
                  const funko = findFunkoByID('./database', request.user, request.message._id);
                  response = {
                    type: 'read',
                    success: true,
                    message: 'Se ha decicido leer un funko',
                    funko: funko
                  }
                  const responseString = JSON.stringify(response);
                  socket.write((responseString));
                } else {
                  response = {
                    type: 'read',
                    success: false,
                    message: 'El funko con id ' + request.message._id + ' ya existe en la BBDD del usuario ' + request.user 
                  }
                  const responseString = JSON.stringify(response);
                  socket.write((responseString));
                }
              } else {
                response = {
                  type: 'read',
                  success: false,
                  message: 'El usuario no existe'
                }
                const responseString = JSON.stringify(response);
                socket.write((responseString));
              }  
              break;
          }
        } else if (!exists && request.type == 'add') {
          createDirectory(request.user);
          createJsonFunkoFile(request.user, request.message);
          response = {
            type: 'add',
            success: true,
            message: 'El funko ha sido creado correctamente. Además el usuario no existia en nuestra BBDD por lo que se le a añadido a la misma'
          }
          const responseString = JSON.stringify(response);
          socket.write((responseString));
        } else {
          response = {
            type: 'error',
            success: false,
            message: 'El usuario no existe'
          }
          const responseString = JSON.stringify(response);
          socket.write((responseString));
        }
      });
    }
  });

  socket.on('end', () => {
    console.log(chalk.bold.cyan('Cliente desconectado'));
  });
});

server.listen(8002, () => {
  console.log(chalk.bold.cyan('Servidor a la escucha en el puerto 8002'));
});
```

Antes de empezar, comentar que la mayor parte de los procesos realizados en el servidor se han realizado mediante APIs síncronas de NODE.js incumpliendo con uno de los requsitos de las prácticas, sin embargo, esto esta explicado en el apartado _[Dificultades/Reflexión](#dificultadesreflexión)_.

La comprobación de si existe un directorio con el nombre del usuario se realiza mediante código asíncrono, haciendo uso de un ejemplo similar al explicado en el ejercicio 1 de esta práctica. Asimismo, se realiza de manera asíncrona la creación de un directorio para un usuario en caso de que este no exista y el mensaje del request sea de tipo _add_. El resto de funciones son síncronas.

Una vez explicado esto, mencionar por encima los aspectos de mayor relevancia del servidor. Primero se procesa la request enviada por el cliente, se examina el tipo de esta y en funcion de este se va realizando el comando en cuestión, con métodos levementes modificados de los usados en la práctica 9 de la asignatura. Tras procesar el comando, se prepara un mensaje de tipo response el cual el servidor le enviará al cliente para que este lo procese e imprima por consola.

## __Dificultades/Reflexión__

La mayor dificultad de esta práctica ha sido la implementación de la API asíncrona de NODE.JS para el ejercicio 3. Tras intentar implementarla como el código síncrono se ejecuta detrás de esta no se estaba obteniendo el resultado deseado en la parte del servidor. Solamente llevé a cabo dos métodos asíncronos, los encargados de comprobar que existe un fichero para un usuario pasado al servidor y la creación de un directorio para ese usuario si no existe y se mando un request de tipo _add_.

El resto de código es similar al de la práctica anterior, síncrono pero con leves modificaciones.

¿A que se debe esto?.

Desde mi punto de vista, me hubiese gustado dejar la práctica lo mejor posible y cumpliendo con todos los requisitos que se pedían. Sin embargo, nos encontramos en un mes bastante complicado en la carrera en el cual contamos con una gran carga de trabajo por parte de las cinco asignaturas, si le sumamos las 4h de jornada laboral que cumplo durante 5 días de la semanas y que el próximo lunes 17 de abril tenemos un examen al cual le he dedicado todo el tiempo posible, pues se me ha hecho muy dificil llevar a cabo la práctica tal y como me gustaría.

Me enorgullece haber sacado tiempo en los descansos y en el transporte entre la universidad y mi casa para adelantar todo lo posible esta práctica. 

Asimismo, comprendo que se nos ha dejado más tiempo para realizarla y que es algo irónico el hecho de que no haya podido completarla, pero como mencioné anteriormente le dedique todo el tiempo posible al examen.

## __Referencias__

[Guión pr10](https://ull-esit-inf-dsi-2223.github.io/prct10-fs-proc-sockets-funko-app/)
[Apuntes bloque 2 de la asignatura](https://ull-esit-inf-dsi-2223.github.io/nodejs-theory/)
[GFuion de la práctica](https://ull-esit-inf-dsi-2223.github.io/prct09-filesystem-funko-app/)
[Coveralls](https://coveralls.io/)
[SonarCloud](https://sonarcloud.io/explore/projects)
[Documentación NODE.js](https://nodejs.org/docs/latest-v19.x/api/fs.html)
[Doc yargs](https://www.npmjs.com/package/yargs)
[Doc chalk](https://www.npmjs.com/package/chalk)
