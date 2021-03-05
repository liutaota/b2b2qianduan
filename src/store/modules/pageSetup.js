const state = {
  pageSetupList: {}
};
const mutations = {
  ADD_PAGE_SET: (state, page) => {
    state.pageSetupList = { ...page.page };
  }
};
const actions = {
  addPage({ commit }, page) {
    commit('ADD_PAGE_SET', page);
  }
};
export default {
  state,
  mutations,
  actions
};
