const greeting = name => console.log(`Hello ${name}`)
const sumNumbers = (...args) => args.reduce((a, b) => a + b, 0);

module.exports = {
  greeting,
  sumNumbers,
}