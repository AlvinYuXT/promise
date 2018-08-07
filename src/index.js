const PENDING = 'pending'
const FULFILLED = 'fulfilled'
const REJECTED = 'rejected'

module.exports = class _Promise {
  constructor(fn) {
    if (typeof fn !== 'function') {
      throw new TypeError(`Promise constructor's argument is not a function`)
    }
    this.status = PENDING
    this.value = null
    this.reason = null
    this.fulfilledCbs = []
    this.rejectedCbs = []
    const resolve = value => {
      // this.handleStatus()
      if (this.status === PENDING) {
        this.status = FULFILLED
        this.value = value
        this.triggerThen()
      }
    }
    const reject = reason => {
      if (this.status === PENDING) {
        this.status = REJECTED
        this.reason = reason
        this.triggerThen()
      }
    }

    try {
      fn(resolve, reject)
    } catch (error) {
      reject(error)
    }
  }

  triggerThen() {
    if (this.status === FULFILLED) {
      this.fulfilledCbs.forEach(callback => {
        callback(this.value)
      })
    }

    if (this.status === REJECTED) {
      this.rejectedCbs.forEach(callback => {
        callback(this.value)
      })
    }
  }

  then(onFulfilled, onRejected) {
    // 如果不是函数就直接吧这个值当做是return出去的值
    if (typeof onFulfilled !== 'function') onFulfilled = value => value
    if (typeof onRejected !== 'function')
      onRejected = err => {
        throw err
      }

    const promise2 = new _Promise((resolve, reject) => {
      // fulfilled
      let result
      if (this.status === FULFILLED) {
        setTimeout(() => {
          try {
            result = onFulfilled(this.value)
            this.resolvePromise(promise2, result, resolve, reject)
          } catch (error) {
            reject(error)
          }
        }, 0)
      }

      if (this.status === REJECTED) {
        setTimeout(() => {
          try {
            result = onRejected(this.reason)
            this.resolvePromise(promise2, result, resolve, reject)
          } catch (error) {
            reject(error)
          }
        }, 0)
      }

      if (this.status === PENDING) {
        this.fulfilledCbs.push(() => {
          setTimeout(() => {
            try {
              result = onFulfilled(this.value)
              this.resolvePromise(promise2, result, resolve, reject)
            } catch (error) {
              reject(error)
            }
          }, 0)
        })

        this.rejectedCbs.push(() => {
          setTimeout(() => {
            result = onRejected(this.reason)
            this.resolvePromise(promise2, result, resolve, reject)
          }, 0)
        })
      }
    })
    return promise2
  }

  // 如果第一个then return了一个Promise
  resolvePromise(promise, value, resolve, reject) {
    // value是个Promise的话就要取他的value
    if (value === promise) {
      return reject(new TypeError('Chaining cycle detected for promise'))
    }
    let called
    if (
      value !== null &&
      (typeof value === 'function' || typeof value === 'object')
    ) {
      try {
        let then = value.then
        if (typeof then === 'function') {
          then.call(
            value,
            res => {
              if (called) return
              called = true
              this.resolvePromise(value, res, resolve, reject)
            },
            error => {
              if (called) return
              called = true
              reject(error)
            }
          )
        } else {
          resolve(value)
        }
      } catch (error) {
        if (called) return
        called = true

        reject(error)
      }
    } else {
        resolve(value)
    }
  }

  catch() {}
}
