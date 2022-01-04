'use strict'

const { expect } = require("chai")

describe('testing lib index file', function () {

  it('lib has properties', async () => {
    const index = require('../index')
    expect(index).to.be.a('object')
    expect(index).to.haveOwnProperty('savePaymentOrder')
    expect(index).to.haveOwnProperty('startPayment')
    expect(index).to.haveOwnProperty('updatePaymentOrder')
  })

})