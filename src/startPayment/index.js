/**
 * Sets the status of the payment order as in process, so that no one
 * else can attempt to pay this order while this payment is in process.
 * 
 * @param {string} balanceId id of the balance which is intended to be payed 
 * @param {string} paymentOrderId id of the payment order 
 * @param {number} amount amount of the debt
 */
const startPayment = deps => async (balanceId, paymentOrderId, amount) => {
  const { dynamoDb, PAYMENT_ORDERS_TABLE, PAYMENT_STATUS } = deps
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
              ':amount': { N: `${amount}` }
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

module.exports = startPayment