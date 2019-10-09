import { Auth } from 'aws-amplify'

export const state = () => ({
    username: null,
})

export const getters = {
    check: state => !! state.username,
    username: state => state.username ? state.username : ''
}

export const mutations = {
    setUser (state, username){
        state.username = username;
    }
}

export const actions = {

    async login(context, loginInfo) {
        // const response = await this.$axios.post('/login', loginInfo)
        Auth.signIn(loginInfo)
            .then(data => {
                context.commit('setUser', loginInfo.username)
                this.$router.push('/mypage')
            })
        .catch(err => this.errors = err)

        
    },

    async register(context, registerInfo) {
        // const response = await this.$axios.post('/register', registerInfo)
        // context.commit('setUser', response.data)
        Auth.signUp(registerInfo.username, registerInfo.password)
            .then(data => {
                context.commit('setUser', registerInfo.username)
                this.$router.push('/auth/registerconfirm')
            })
            .catch(err => this.errors = err)
    },

    async register_confirm(context, data) {
        Auth.confirmSignUp(data.email, data.code)
            .then(data => {
                // context.commit('setUser', registerInfo.username)
                this.$router.push('/auth/login')
            })
            .catch(err => this.errors = err)
    },

    async logout(context) {
        // const response = await this.$axios.post('/logout')
        // context.commit('setUser', null)
        Auth.signOut()
            .then(data => {
                context.commit('setUser', '')
                this.$router.push('/')
            })

    },

    async check (context) {
        await Auth.currentUserInfo()
            .then(data => {
                context.commit('setUser', data.username)
            })
            .catch(error => {
                context.commit('setUser', '')
            })
        
    }
}

// export default {
//     namespaced: true,
//     state,
//     getters,
//     mutations,
//     actions
// }