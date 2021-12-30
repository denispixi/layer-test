// @ts-check
const crypto = require('crypto')
const AWS = require('aws-sdk')

const deps = {
  crypto,
  dynamoDb: new AWS.DynamoDB({ region: 'us-east-1' }),
  PAYMENT_ORDERS_TABLE: 'tbk-payment-orders',
  PAYMENT_STATUS: {
    pending: 'pending',
    paying: 'paying',
    paid: 'paid',
    error: 'error',
  }
}

module.exports = {
  savePaymentOrder: require('./src/savePaymentOrder')(deps),
  startPayment: require('./src/startPayment')(deps),
  updatePaymentOrder: require('./src/updatePaymentOrder')(deps)
}