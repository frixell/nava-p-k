require('whatwg-fetch');
require('@testing-library/jest-dom');

const { TextDecoder, TextEncoder } = require('util');
const { TransformStream } = require('web-streams-polyfill/dist/ponyfill.js');

if (!global.TextEncoder) {
  global.TextEncoder = TextEncoder;
}

if (!global.TextDecoder) {
  global.TextDecoder = TextDecoder;
}

if (!global.TransformStream) {
  global.TransformStream = TransformStream;
}

if (!global.BroadcastChannel) {
  global.BroadcastChannel = class {
    constructor() {}
    postMessage() {}
    close() {}
    addEventListener() {}
    removeEventListener() {}
    onmessage() {}
  };
}

const { server } = require('./msw/server');

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
