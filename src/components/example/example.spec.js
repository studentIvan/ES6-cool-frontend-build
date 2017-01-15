import goExample from './example';
import { StressTest } from '../../../tape-stress';

new StressTest(goExample, { runs: 5000 });

/* StressTest advantages demonstration */
// new StressTest(goExample, {
//   runs: 15,
//   timeout: 1000,
//   echo: true,
//   params: [
//     String,
//     Number,
//     { type: Object, keys: { a: String, lastName: { type: String, optional: true, faker: '{{name.lastName}}' } } },
//     { type: String, length: 64, optional: true },
//     { type: String, faker: '{{name.lastName}}, {{name.firstName}} {{name.suffix}}' },
//     Boolean,
//     true,
//     [Boolean]
//   ]
// });
