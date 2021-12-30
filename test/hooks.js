'use strict'
process.env.NODE_ENV = 'test'

module.exports.mochaHooks = {

  beforeAll: async function () {
    this.timeout(20000)
    this.deps = {
      crypto: require('crypto'),
      PAYMENT_ORDERS_TABLE: 'tbk-payment-orders',
      PAYMENT_STATUS: {
        pending: 'pending',
        paying: 'paying',
        paid: 'paid',
        error: 'error',
      }
    }
  },

  afterAll: async function () {
    this.timeout(20000)
  }
}
