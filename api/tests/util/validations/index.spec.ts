import { describe } from 'mocha'
import { assert } from 'chai'
import { isValidEmail } from '../../../src/util/validations'

describe('Validation functions', () => {
  describe('#isValidEmail', () => {
    it('returns true on valid email', () => {
      assert.isTrue(isValidEmail('test@test.com'), 'test@test.com')
      // assert.isTrue(isValidEmail('test+1@test.com'), 'test+1@test.com')
      // assert.isTrue(isValidEmail('test_one+1@test.com'), 'test_one+1@test.com')
    })

    it('returns false on invalid emails', () => {
      assert.isFalse(isValidEmail('test'))
      assert.isFalse(isValidEmail('test.com'))
      assert.isFalse(isValidEmail('@test.com'))
    })
  })
})
