function helloWorld() {
  console.log("hello world");
}

const exports = {
  helloWorld,
}

export default exports;

globalThis.exports = exports;
