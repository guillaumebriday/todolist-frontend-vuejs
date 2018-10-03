import Errors from '@utils/Errors'
import axios from 'axios'

class Form {
  /**
   * Create a new Form instance.
   *
   * @param {object} data
   */
  constructor (data) {
    this.originalData = data

    for (const field in data) {
      this[field] = data[field]
    }

    this.errors = new Errors()
  }

  /**
   * Fetch all relevant data for the form.
   */
  data () {
    const data = {}

    for (const property in this.originalData) {
      data[property] = this[property]
    }

    return data
  }

  /**
   * Return true if the form is incompleted.
   */
  incompleted () {
    return !this.completed()
  }

  /**
   * Return true if the form is completed.
   */
  completed () {
    for (const field in this.originalData) {
      if (this[field] === '' || this[field] === null) {
        return false
      }
    }

    return true
  }

  /**
   * Reset the form fields and errors.
   */
  reset () {
    this.resetFields()

    this.errors.clear()
  }

  /**
   * Reset the form fields and errors.
   */
  resetFields () {
    for (const field in this.originalData) {
      this[field] = ''
    }
  }

  /**
   * Send a POST request to the given URL.
   * .
   * @param {string} url
   */
  post (url) {
    return this.submit('post', url)
  }

  /**
   * Send a PUT request to the given URL.
   * .
   * @param {string} url
   */
  put (url) {
    return this.submit('put', url)
  }

  /**
   * Send a PATCH request to the given URL.
   * .
   * @param {string} url
   */
  patch (url) {
    return this.submit('patch', url)
  }

  /**
   * Send a DELETE request to the given URL.
   * .
   * @param {string} url
   */
  delete (url) {
    return this.submit('delete', url)
  }

  /**
   * Submit the form.
   *
   * @param {string} requestType
   * @param {string} url
   */
  submit (requestType, url) {
    return new Promise((resolve, reject) => {
      axios[requestType](url, this.data())
        .then(response => {
          this.onSuccess(response.data)

          resolve(response.data)
        })
        .catch(error => {
          this.onFail(error.response.data.errors)

          reject(error.response.data)
        })
    })
  }

  /**
   * Handle a successful form submission.
   *
   * @param {object} data
   */
  onSuccess (data) {
    // this.reset()
  }

  /**
   * Handle a failed form submission.
   *
   * @param {object} errors
   */
  onFail (errors) {
    this.errors.record(errors)
  }
}

export default Form
