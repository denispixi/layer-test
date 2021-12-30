'use strict'

const chai = require("chai")
const { expect } = chai
chai.use(require('chai-as-promised'))
const AWSMock = require('aws-sdk-mock')
const AWS = require('aws-sdk')
const updatePaymentOrder = require('./index')

describe('testing lib index file', function () {

  // before(async () => {
  //   // set up a mock call to DynamoDB
  //   // AWSMock.setSDKInstance(AWS)
  // })

  // after(() => {
  //   // restore normal functionality
  //   // AWSMock.restore('DynamoDB')
  // })

  it('lib has properties', async () => {
    const index = require('./index')
    expect(index).to.be.a('object')
    expect(index).to.haveOwnProperty('savePaymentOrder')
    expect(index).to.haveOwnProperty('startPayment')
    expect(index).to.haveOwnProperty('updatePaymentOrder')
  })

})