import path from 'path';
import os from 'os';

const { LocalStorage } = require('node-localstorage');

global.fetch = require('jest-fetch-mock');

global.localStorage = new LocalStorage(
  path.join(os.tmpdir(), 'node-localstorage')
);

global.window = document.defaultView;
global.window.localStorage = global.localStorage;

// CodeMirror needs all of this in order to work.
// see: https://discuss.codemirror.net/t/working-in-jsdom-or-node-js-natively/138/5
global.document.body.createTextRange = function() {
  return {
    setEnd() {},
    setStart() {},
    getBoundingClientRect() {
      return { right: 0 };
    },
    getClientRects() {
      return {
        length: 0,
        left: 0,
        right: 0
      };
    }
  };
};
