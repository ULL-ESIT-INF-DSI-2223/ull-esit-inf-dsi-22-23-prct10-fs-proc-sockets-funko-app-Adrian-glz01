/**
 * Interfaz que representa un comando
 * @interface Command
 * @property {string} command - Comando a ejecutar
 * @property {string[]} args - Argumentos del comando
 */
export interface Command {
  command: string;
  args: string[];
}