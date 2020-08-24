import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default () => {
  const store = new Vuex.Store({
    state: {
      username: 'Bob'
    },
    mutations: {
      changeName (state, payload) {
        state.username = payload
      }
    },
    actions: {
      asyncChangeName ({commit}, payload) {
        return new Promise((resolve,reject)=>{
          setTimeout(() => {
            commit('changeName', payload)
            resolve();
          }, 3000);
        })
      }
    }
  })

  if(typeof window !=='undefined' && window.__INITIAL_STATE__){
    store.replaceState(window.__INITIAL_STATE__)
  }
  return store
}