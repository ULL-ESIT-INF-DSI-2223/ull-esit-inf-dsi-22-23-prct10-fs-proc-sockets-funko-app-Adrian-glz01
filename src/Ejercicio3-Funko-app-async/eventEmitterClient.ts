import * as net from 'net';
import { EventEmitter } from 'events';
import {RequestType} from './types';

/**
 * @description Clase que implementa un cliente de tipo EventEmitter
 * @class MessageEventEmitterClient
 * @extends EventEmitter
 */
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