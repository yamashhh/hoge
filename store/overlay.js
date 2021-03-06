export const state = () => ({
  overlay: false
})

export const getters = {
  getOverlay(state) {
    return state.overlay
  }
}

export const mutations = {
  SWITCH_OVERLAY(state, bool) {
    state.overlay = bool
  }
}

export const actions = {
  switchOverlay({ commit }, bool) {
    commit('SWITCH_OVERLAY', bool)
  }
}
