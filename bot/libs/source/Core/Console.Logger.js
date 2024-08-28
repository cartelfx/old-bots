const chalk = require("chalk");

const chalks = {
  bgBlue: chalk.bgBlue,
  black: chalk.black,
  green: chalk.green,
};

const types = {
  log: chalks.bgBlue,
  warn: chalks.black.bgHex('#D9A384'),
  error: chalks.black.bgHex('#FF0000'),
  debug: chalks.green,
  cmd: chalks.black.bgHex('#8dbe85'),
  successfully: chalks.black.bgHex('#48D09B'),
  fetched: chalks.black.bgHex('##2e14db'),
  mongodb: chalks.black.bgHex('#55f3df'),
  load: chalks.black.bgHex('#00D6FF'),
  warn: chalks.black.bgHex('#EEA2AD'),
  caution: chalks.black.bgHex('#FF0000'),
  event: chalks.black.bgHex('#008282'),
  category: chalks.black.bgHex('#E8D4A9'),
  routers: chalks.black.bgHex('#eea962'),
  default: chalks.black.bgHex('#eea962')
};

module.exports = class ConsoleLogger {
    /**
     * @param {String} data 
     * @param {String} type 
     */
  static log(data, type) {
    const formatter = types[type] || types.default;
    console.log(`${formatter(type.toUpperCase())} ${data}`);
  }
};