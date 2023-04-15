import 'mocha'
import { expect } from 'chai'

import {getIds} from '../src/Ejercicio3-Funko-app-async/utilities2'


describe('Test ejercicio 3' , () => {
  it ('Primer test del metodo getIds', () => {
    expect(getIds('./database/Adrian')).to.be.deep.equal([4,2]);
  })
  it ('Segundo test del metodo getIds', () => {
    expect(getIds('./database/Eva')).to.be.deep.equal([1,2]);
  })
});