/*
This file uses the dotenv package to collect all the environment variables and 
store them in a parse object which can be exported as a module and accessed anywhere
It allows the .env file to be removed at runtime - see .env.example to copy structure
*/

const dotenv = require('dotenv');
const result = dotenv.config();
if (result.error) {
  throw result.error;
}
const { parsed: envs } = result;

module.exports = envs;