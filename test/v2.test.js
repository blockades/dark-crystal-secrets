const { describe } = require('tape-plus')
const { share, combine, verify } = require('../v2')

describe('secrets-wrapper (v2)', context => {
  let secret, numRecps, quorum

  context.beforeEach(c => {
    secret = Math.random().toString(36)
    numRecps = 5
    quorum = 3
  })

  context('secret can be reproduced from quorum of shards', (assert, next) => {
    try {
      const shards = share(secret, numRecps, quorum).slice(2)
      var result = combine(shards)
    } catch (err) {
      assert.notOk(err, 'does not throw an error')
    }
    assert.equal(result, secret, 'secret recovered')
    next()
  })

  context('shards can be used to checksig of a secret', (assert, next) => {
    const shards = share(secret, numRecps, quorum)
    var result = verify(shards)
    assert.ok(result)
    next()
  })

  context('secret cannot be reproduced from less than quorum of shards', (assert, next) => {
    try {
      const shards = share(secret, numRecps, quorum).slice(3)
      var result = combine(shards)
    } catch (err) {
      assert.ok(err, 'throws an error')
    }
    assert.notEqual(result, secret, 'secret not recovered')
    next()
  })

  context('secret cannot be reproduced when an invalid shard is given', (assert, next) => {
    try {
      var shards = share(secret, numRecps, quorum)
      shards[1] = 'this is not a shard'
      var result = combine(shards)
    } catch (err) {
      assert.ok(err, 'throws an error')
    }
    assert.notEqual(result, secret, 'secret not recovered')
    next()
  })
})
