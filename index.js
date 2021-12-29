const { DynamoDB } = require('aws-sdk')
const crypto = require('crypto')
const dynamoDb = new DynamoDB()

const PAYMENT_ORDERS_TABLE = 'tbk-payment-orders'
const PAYMENT_STATUS = {
  pending: 'pending',
  paying: 'paying',
  paid: 'paid',
}

/**
 * Save a payment order in DynamoDB
 * 
 * @param {string} balanceId 
 * @param {number} amount 
 */
const savePaymentOrder = async (balanceId, amount) => {
  try {
    const paymentOrderId = crypto.randomUUID()
    return await dynamoDb.putItem({
      TableName: PAYMENT_ORDERS_TABLE,
      Item: {
        'balanceId': { S: balanceId },
        'paymentOrderId': { S: paymentOrderId },
        'amount': { S: `${amount}` },
        'status': { S: PAYMENT_STATUS.pending },
        // lastUpdate: undefined,
      },
    }).promise()
  } catch (error) {
    console.log('There was an error creating the payment order', error)
    throw error
  }
}

/**
 * Sets the status of the payment order as in process, so that no one
 * else can attempt to pay this order while this payment is in process.
 * 
 * @param {string} balanceId 
 * @param {string} paymentOrderId 
 * @param {number} amount 
 */
const startPayment = async (balanceId, paymentOrderId, amount) => {
  try {
    // TODO: Validate the amount vs the value of the table
    return await dynamoDb.transactWriteItems({
      TransactItems: [
        {
          Update: {
            TableName: PAYMENT_ORDERS_TABLE,
            Key: {
              'balanceId': { S: balanceId },
              'paymentOrderId': { S: paymentOrderId },
            },
            ConditionExpression: '#status = :statusPending and #amount = :amount',
            UpdateExpression: 'SET #status = :statusPaying, #lastUpdate = :lastUpdate',
            ExpressionAttributeNames: {
              '#status': 'status',
              '#lastUpdate': 'lastUpdate',
              '#amount': 'amount',
            },
            ExpressionAttributeValues: {
              ':statusPending': { S: PAYMENT_STATUS.pending },
              ':statusPaying': { S: PAYMENT_STATUS.paying },
              ':lastUpdate': { S: new Date().toISOString() },
              ':amount': { N: amount }
            }
          }
        }
      ]
    }).promise()
  } catch (error) {
    console.log('There was an error processing the transaction', error)
    throw error
  }
}

/**
 * Sets the status of the payment order as in process, so that no one
 * else can attempt to pay this order while this payment is in process.
 * 
 * @param {string} balanceId 
 * @param {string} paymentOrderId
 */
const updatePaymentOrder = async (balanceId, paymentOrderId) => {
  try {
    // TODO: Validate the amount vs the value of the table
    return await dynamoDb.transactWriteItems({
      TransactItems: [
        {
          Update: {
            TableName: PAYMENT_ORDERS_TABLE,
            Key: {
              'balanceId': { S: balanceId },
              'paymentOrderId': { S: paymentOrderId },
            },
            ConditionExpression: '#status = :statusPaying',
            UpdateExpression: 'SET #status = :statusPaid, #lastUpdate = :lastUpdate',
            ExpressionAttributeNames: {
              '#status': 'status',
              '#lastUpdate': 'lastUpdate',
            },
            ExpressionAttributeValues: {
              ':statusPaying': { S: PAYMENT_STATUS.paying },
              ':statusPaid': { S: PAYMENT_STATUS.paid },
              ':lastUpdate': { S: new Date().toISOString() },
            }
          }
        }
      ]
    }).promise()
  } catch (error) {
    console.log('There was an error processing the transaction', error)
    throw error
  }
}

module.exports = {
  startPayment,
  savePaymentOrder,
  updatePaymentOrder,
}