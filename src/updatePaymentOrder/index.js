/**
 * Sets the status of the payment order as in process, so that no one
 * else can attempt to pay this order while this payment is in process.
 * 
 * @param {string} balanceId id of the balance which is intended to be payed 
 * @param {string} paymentOrderId id of the payment order 
 * @param {boolean} withError indicates if the status must be updated to paid or error 
 */
 const updatePaymentOrder = deps => async (balanceId, paymentOrderId, withError) => {
  const { dynamoDb, PAYMENT_ORDERS_TABLE, PAYMENT_STATUS } = deps
  try {
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
              ':statusPaid': { S: withError ? PAYMENT_STATUS.error : PAYMENT_STATUS.paid },
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

module.exports = updatePaymentOrder