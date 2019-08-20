
export const state = () => ({
    user: null,
})

export const getters = {
    check: state => !! state.user,
    username: state => state.user ? state.user.name : ''
}

export const mutations = {
    setUser (state, user){
        state.user = user;
    }
}

export const actions = {
    async login(context, loginInfo) {
        const response = await this.$axios.post('/login', loginInfo)
        context.commit('setUser', response.data)
    },

    async register(context, registerInfo) {
        const response = await this.$axios.post('/register', registerInfo)
        context.commit('setUser', response.data)
    },

    async logout(context) {
        const response = await this.$axios.post('/logout')
        context.commit('setUser', null)
    },

    async currentUser (context) {
        const response = await this.$axios.get('/user')
        const user = response.data || null
        context.commit('setUser', user)
    }
}

// export default {
//     namespaced: true,
//     state,
//     getters,
//     mutations,
//     actions
// }