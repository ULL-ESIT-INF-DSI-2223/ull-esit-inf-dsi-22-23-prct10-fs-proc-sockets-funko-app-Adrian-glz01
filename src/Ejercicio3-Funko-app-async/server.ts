import * as net from 'net';
import * as chalk from 'chalk';
import { userExistOnBD, createDirectory, createJsonFunkoFile, checkUserDirSync, removeFunko, listFunko, findFunkoByID } from './utilities';
import { getIds } from './utilities2';
import { ResponseType } from './types';

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