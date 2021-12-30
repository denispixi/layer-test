'use strict'

const chai = require("chai")
const { expect } = chai
chai.use(require('chai-as-promised'))
const AWSMock = require('aws-sdk-mock')
const AWS = require('aws-sdk')
const updatePaymentOrder = require('./index')

describe('testing updatePaymentOrder method', function () {

  let deps

  before(async () => {
    // set up a mock call to DynamoDB
    deps = this.ctx.deps
    AWSMock.setSDKInstance(AWS)
  })

  after(() => {
    // restore normal functionality
    AWSMock.restore('DynamoDB')
  })

  it('updatePaymentOrder method - OK', async () => {
    {
      // DynamoDB Transaction Mocks
      AWSMock.mock('DynamoDB', 'transactWriteItems', (_params, callback) => {
        console.log('Let us not call AWS DynamoDB and say we did.')
        return callback(null, {})
      })
      deps = {
        ...deps,
        dynamoDb: new AWS.DynamoDB({ region: 'us-east-1' })
      }
    }
    const result = await updatePaymentOrder(deps)('foo', 'bar', true)
    expect(result).to.be.a('object')
    expect(result).to.be.empty
  })

  it('updatePaymentOrder method - ERROR', async () => {
    {
      // DynamoDB Transaction Mocks
      AWSMock.remock('DynamoDB', 'transactWriteItems', (_params, callback) => {
        console.log('Let us not call AWS DynamoDB and say we did... with error')
        return callback(new Error('Error processing the transaction for update the payment order'))
      })
      deps = {
        ...deps,
        dynamoDb: new AWS.DynamoDB({ region: 'us-east-1' })
      }
    }
    try {
      await updatePaymentOrder(deps)('foo', 'bar', true)
    } catch (error) {
      console.log(error.message)
      expect(error.message).to.be.equal('Error processing the transaction for update the payment order')
    }
  })

})