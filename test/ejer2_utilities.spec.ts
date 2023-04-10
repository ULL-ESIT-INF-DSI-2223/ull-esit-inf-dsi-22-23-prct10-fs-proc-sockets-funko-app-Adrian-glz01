import 'mocha'
import { expect } from 'chai'

import {checkFileExistsSync} from '../src/Ejercicio2-readFileContent/withOutPipeStream/utilities'

describe('Tests Ejercicio 2 - With Out Pipes', () => {
  describe('checkFileExistsSync', () => {
    it('Test checkFileExistsSync para un fichero existente', () => {
      expect(checkFileExistsSync('helloworld.txt')).to.be.true;
    });
    it('Test checkFileExistsSync para un fichero no existente', () => {
      expect(checkFileExistsSync('noexist.txt')).to.be.false;
    });
    it ('Test checkFileExistsSync para un fichero existente', () => {
      expect(checkFileExistsSync('instalaciones.txt')).to.be.true;
    });
  });
});