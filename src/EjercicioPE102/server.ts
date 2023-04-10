import * as net from "net";
import { exec } from "child_process";
import { Command } from "./command";

/**
 * @descriptionClase que representa un servidor
 * @class Server
 */
export class Server {

  constructor() {
    console.log("Servidor creado");
  }

  /**
   * @description Método que ejecuta el servidor
   * @method run
   */
  public run():string {
    const server = net.createServer((socket: net.Socket) => {
      console.log("Se ha conectado un cliente");
    
      socket.on("data", (data: Buffer) => {
        const commandData = data.toString().trim();
    
        try {
          const { command, args } = JSON.parse(commandData) as Command;
    
          // mensaje para comprobar que el comando llego correctamente
          console.log(`Comando recibido: ` + command + ` ` + args.join(" ")); // consola en el servidor
    
          exec(`${command} ${args.join(" ")}`, (error, stdout, stderr) => {
            if (error) {
              console.error(`Error al ejecutar el comando: ` + error.message); // consola en el servidor
              socket.write(`Error al ejecutar el comando: ` + error.message); // consola en el cliente
              return; // breakpoint
            }
            if (stderr) {
              console.error(`Error al ejecutar el comando: ` + stderr); // consola en el servidor
              socket.write(`Error al ejecutar el comando: ` + stderr); // consola en el cliente
              return;
            }
            console.log(`Comando ejecutado correctamente en el cliente.`); // consola en el servidor
            socket.write(stdout); // consola en el cliente mostrando el resultado del comando
            console.log(stdout)
            return stdout;
          });
        } catch (error) {
          console.error(`Error al procesar el comando: ${error.message}`);
          socket.write(`Error al procesar el comando: ${error.message}`);
        }
      });
    });
    
    //! cambiar en caso de cerrar conexiones, acordarse de matar al proceso
    const Port = 3003;
    
    server.listen(Port, () => {
      console.log(`Esperando comunicación por parte del cliente en el puerto ` + Port);
    });
    return "";
  }
} 

// const server = new Server();
// server.run();