/**
 * Create a payment order in DynamoDB
 * 
 * @param {string} balanceId id of the balance which is intended to be payed 
 * @param {number} amount amount of the debt
 */
const savePaymentOrder = deps => async (balanceId, amount) => {
  const { crypto, dynamoDb, PAYMENT_ORDERS_TABLE, PAYMENT_STATUS } = deps
  try {
    const paymentOrderId = crypto.randomUUID()
    return await dynamoDb.putItem({
      TableName: PAYMENT_ORDERS_TABLE,
      Item: {
        'balanceId': { S: balanceId },
        'paymentOrderId': { S: paymentOrderId },
        'amount': { N: `${amount}` },
        'status': { S: PAYMENT_STATUS.pending },
      },
    }).promise()
  } catch (error) {
    console.log('There was an error creating the payment order')
    throw error
  }
}

module.exports = savePaymentOrder