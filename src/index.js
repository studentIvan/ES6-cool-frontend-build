import example from './components/example/example';
import './index.pug';

const b = 4;
console.log('hello world 222', example(), Object.assign({ b }, { a: 2 })); // eslint-disable-line no-console
