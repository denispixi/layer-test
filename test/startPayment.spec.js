'use strict'

const chai = require("chai")
const { expect } = chai
chai.use(require('chai-as-promised'))
const AWSMock = require('aws-sdk-mock')
const AWS = require('aws-sdk')
const startPayment = require('../src/startPayment/index')

describe('testing startPayment method', function () {

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

  it('startPayment method - OK', async () => {
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
    const result = await startPayment(deps)('foo', 'bar', 2000)
    expect(result).to.be.a('object')
    expect(result).not.to.be.empty
  })

  it('startPayment method - ERROR', async () => {
    {
      // DynamoDB Transaction Mocks
      AWSMock.remock('DynamoDB', 'transactWriteItems', (_params, callback) => {
        console.log('Let us not call AWS DynamoDB and say we did... with error')
        return callback(new Error('Error processing the transaction for start payment'))
      })
      deps = {
        ...deps,
        dynamoDb: new AWS.DynamoDB({ region: 'us-east-1' })
      }
    }
    try {
      await startPayment(deps)('foo', 'bar', 2000)
    } catch (error) {
      console.log(error.message)
      expect(error.message).to.be.equal('Error processing the transaction for start payment')
    }
  })

})