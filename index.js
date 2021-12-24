const greeting = name => console.log(`Hello ${name}`)
const sumNumbers = (...args) => {
  const sum = args.reduce((a, b) => a + b, 0)
  console.log(`The sum is ${sum}`);
}

module.exports = {
  greeting,
  sumNumbers,
}