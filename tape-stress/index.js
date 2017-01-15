import test from 'tape';
import faker from 'faker';

/**
 * StressTest - tape test API runner
 * @version 1.0
 * @author studentivan.ru
 */
export class StressTest {
  /**
   * Create and run tape stress test of function
   * @param  {Function} subject - tested function
   * @param  {Number=1} [options.runs] - total count of runs
   * @param  {String} [options.name] - test name
   * @param  {Number} [options.timeout] - test timeout
   * @param  {Boolean=false} [options.echo] - log generated params in console
   * @param  {Array} [options.params] - params interface
   * @param  {Object} [options.context] - tested function context
   */
  constructor(subject, {
    runs = 1,
    name = `stress test of ${ subject.name }`,
    timeout = null,
    echo = false,
    params = null,
    context = this
  } = {}) {
    const tapeTestOptions = {};
    if (timeout) { tapeTestOptions.timeout = timeout; }
    this._interface = params;
    this.echoMode = echo;
    test(name, tapeTestOptions, (t) => {
      t.plan(runs);
      [...Array(runs).keys()].forEach((i) => {
        const mockArguments = this.createMockArguments();
        t.pass(subject.apply(context, mockArguments));
      });
    });
  }

  createMockArguments() {
    const mockArgs = [];
    if (this._interface) {
      const getRandomItem = (items) => {
        return items[Math.floor(Math.random() * items.length)];
      };

      const getRandomString = (length = 32) => {
        return Array(length + 1).join((Math.random()
          .toString(36) + '00000000000000000').slice(2, 18)).slice(0, length);
      };

      const getRandomIntInclusive = (min = 0, max = 255) => {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
      };

      const createMockArgument = (argument, info = {}) => {
        if (argument === Boolean) {
          return getRandomItem([true, false]);
        }
        else if (argument === String) {
          return info.faker ? faker.fake(info.faker)
            : getRandomString(info.length);
        }
        else if (argument === Number) {
          return info.faker ? +faker.fake(info.faker)
            : getRandomIntInclusive(info.min, info.max);
        }
        else if (argument === Object) {
          const options = {};
          if (info.keys) {
            Object.keys(info.keys).forEach((key) => {
              const argument = info.keys[key];
              const argumentDescribed = typeof argument === 'object' && argument.type;
              if (argumentDescribed && argument.optional) {
                if (getRandomItem([true, false])) {
                  options[key] = createMockArgument(argument.type, argument);
                }
              }
              else {
                options[key] = !argumentDescribed
                  ? createMockArgument(argument)
                  : createMockArgument(argument.type, argument);
              }
            });
          }
          return options;
        }
        else {
          return argument;
        }
      };

      for (let argument of this._interface) {
        const argumentDescribed = typeof argument === 'object' && argument.type;
        if (Array.isArray(argument) || argumentDescribed && argument.optional) {
          if (getRandomItem([true, false])) {
            if (Array.isArray(argument)) {
              mockArgs.push(createMockArgument(argument[0]));
            }
            else {
              mockArgs.push(createMockArgument(argument.type, argument));
            }
          }
        }
        else if (argumentDescribed) {
          mockArgs.push(createMockArgument(argument.type, argument));
        }
        else {
          mockArgs.push(createMockArgument(argument));
        }
      }
    }
    if (this.echoMode) {
      console.log('Generated call arguments: (' + mockArgs.length + ')\n', mockArgs);
    }
    return mockArgs;
  }
}
