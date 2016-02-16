'use strict';

const TARGET = process.env.npm_lifecycle_event;
let env = 'build';

switch (TARGET) {
  case 'start':
  case 'ios':
  case 'android':
    env = 'development';
    break;
  default:
    env = 'build';
}

module.exports = env;
