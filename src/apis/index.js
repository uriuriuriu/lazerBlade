import Vue from 'vue'
import store from 'src/vuex/store'

let apiUniqKey = 0
export const get = async (url, data, feedback = false) => {
  apiUniqKey++
  let uniqKey = apiUniqKey
  let err = null
  try {
    console.log(`%c[GET] [REQ_BODY]`, 'color:#aaa', url, data.params)
    store.dispatch('apiLoadStart', { key: uniqKey, url: url, data: data })
    let res = await new Promise((resolve, reject) => {
      Vue.http.get(url, data).then((res) => {
        resolve(res)
      }, (err) => {
        reject(err)
      })
    })
    if (feedback) {
      return res.data
    }
    if (res.status !== 200) err = new Error(`${res.status} status error.`)
    if (res.data.flag !== 0) err = new Error(res.data.msg)
    if (!err) return res.data
  } catch (e) {
    console.log(`%c[REQ_ERR] ${e.message}`, 'color:red', url, data.params, this)
  } finally {
    if (err) console.log(`%c[REQ_ERR] ${err.message}`, 'color:red', url, data.params, this)
    store.dispatch('apiLoadEnd', { key: uniqKey, url: url, data: data })
  }
}

const BASE_URL = 'https://api.github.com'

export const GET_USER_URL = BASE_URL + '/users'
