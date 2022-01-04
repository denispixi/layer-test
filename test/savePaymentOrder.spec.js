'use strict'

const chai = require("chai")
const { expect } = chai
chai.use(require('chai-as-promised'))
const AWSMock = require('aws-sdk-mock')
const AWS = require('aws-sdk')
const savePaymentOrder = require('../src/savePaymentOrder/index')

describe('querying items from dynamodb', function () {

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

  it('testing save item in Dynamo - OK', async () => {
    {
      // DynamoDB Mocks
      AWSMock.mock('DynamoDB', 'putItem', (_params, callback) => {
        console.log('Let us not call AWS DynamoDB and say we did.')
        return callback(null, {})
      })
      deps = {
        ...deps,
        dynamoDb: new AWS.DynamoDB({ region: 'us-east-1' })
      }
    }
    const result = await savePaymentOrder(deps)('fakeId', 2000)
    expect(result).to.be.a('object')
    expect(result).to.be.empty
  })

  it('testing save item in Dynamo - ERROR', async () => {
    {
      // DynamoDB Mocks
      AWSMock.remock('DynamoDB', 'putItem', (_params, callback) => {
        console.log('Let us not call AWS DynamoDB and say we did... with error')
        return callback(new Error('Error saving item'))
      })
      deps = {
        ...deps,
        dynamoDb: new AWS.DynamoDB({ region: 'us-east-1' })
      }
    }
    try {
      await savePaymentOrder(deps)('fakeId', 2000)
    } catch (error) {
      console.log(error.message)
      expect(error.message).to.be.equal('Error saving item')
    }
  })

})