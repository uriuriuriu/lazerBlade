import * as types from 'src/vuex/mutation-types'
import _ from 'lodash'

const state = {
  title: '',
  loadingSets: [],
  loadingCount: 0,
  windowWidth: 0
}

const mutations = {
  [types.SET_TITLE] (state, title) {
    state.title = title
  },
  [types.API_LOAD_START] (state, data) {
    state.loadingSets.push(data)
    state.loadingCount = state.loadingSets.length
  },
  [types.API_LOAD_END] (state, data) {
    _.remove(state.loadingSets, function (n) {
      return n.key === data.key
    })
    state.loadingCount = state.loadingSets.length
  },
  [types.SET_WINDOW_WIDTH] (state, width) {
    state.windowWidth = width
  }

}

export default {
  state,
  mutations
}
