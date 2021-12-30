const methods = require('./index')

async function gg() {
  // const result = await methods.savePaymentOrder('1', 200)
  const result = await methods.updatePaymentOrder('1', '193bdb0f-bc38-41f3-a770-07a6bd9776bc')
  console.log(result)
}

gg()