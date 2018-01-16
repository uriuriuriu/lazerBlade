import * as types from './mutation-types'

export const setTitle = ({ commit }, title) => {
  commit(types.SET_TITLE, title)
}

export const apiLoadStart = ({ commit }, creds) => {
  commit(types.API_LOAD_START, creds)
}
export const apiLoadEnd = ({ commit }, creds) => {
  commit(types.API_LOAD_END, creds)
}

export const setWindowWidth = ({ commit }, windowWidth) => {
  commit(types.SET_WINDOW_WIDTH, windowWidth)
}
