import * as net from "net";
import { Command } from "./command";
import { exit } from "process";
// import { command } from "yargs";

// variables globales
//! Recordar cambiar el puerto cada vez que se cierra una conexión
//? Y cerrar el proceso con el comando kill
const PORT = 3003;
// const HOST = "localhost";

/**
 * @descriptionClase que representa un cliente
 * @class Client
 */
export class Client {
  private command_: Command;

  constructor(command: Command) {
    this.command_ = command;
  }

  /**
   * @description Método que ejecuta el cliente
   * @method run
   */
  public run(): void {
    const client = new net.Socket();

    client.connect(PORT, () => {
      console.log("Conectado al servidor en el puerto: " + PORT);
    
      // Lectura de la línea de comandos
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      // const readline = require("readline").createInterface({
      //   input: process.stdin,
      //   output: process.stdout,
      // });
    
      // readline.question("Ingrese el comando: ", (command: string) => {
      //   readline.question(
      //     "Ingrese los argumentos separados por espacios, si no hay parametros solamente pulse enter: ",
      //     (args: string) => {
      //       const commandData: Command = {
      //         command,
      //         // if (args) {
      //         //   args: args.split(" "),
      //         // } else {
      //         //   args: [],
      //         // },
      //         args: args ? args.split(" ") : [], // si args tiene algun valor(es true) se ejecuta el split, si no es false y se manda un array vacio
      //       };
    
      //       client.write(JSON.stringify(this.command_));
      //     }
      //   );
      // });
      client.write(JSON.stringify(this.command_));
    });
    
    // esperamos respuesta del servidor
    client.on("data", (data: Buffer) => {
      console.log(`Respuesta del servidor: ` + data.toString());
      client.destroy(); // cerrar la conexión del cliente
    });
    
    // cerramos cliente 
    client.on("close", () => {
      console.log("Conexión cerrada");
      exit(0);
    });
  }
}

// objeto client

const command1 = {
  command: "cat",
  args: ["helloworld.txt"],
}

// const client = new Client(command1);
// client.run();