const promisesAplusTests = require('promises-aplus-tests')
const fs = require('fs')
const path = require('path')
const Promise = require('../src/index')

const adapter = {
  deferred() {
    let resolve, reject
    const promise = new Promise((_resolve, _reject) => {
      resolve = _resolve
      reject = _reject
    })
    return {
      promise,
      resolve,
      reject
    }
  }
}

promisesAplusTests(adapter, function(err) {
  // All done; output is in the console. Or check `err` for number of failures.
  fs.writeFileSync(path.join(__dirname, '../log'), err)
  console.error(err)
})

module.exports = adapter