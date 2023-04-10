import 'mocha'
import { expect } from 'chai'

import { Client } from '../src/EjercicioPE102/client'
import { Command } from '../src/EjercicioPE102/command'
import { Server } from '../src/EjercicioPE102/server'

describe('Tests Ejercicio PE102', () => {
  const command1: Command = {
    command: 'cat',
    args: ['helloworld.txt'],
  }
  const client1 = new Client(command1);
  const server1 = new Server();
  client1.run();
  it ('Test server', () => {
    expect(server1.run()).to.be.eql('Hola que tal te va la vida');
  });
});