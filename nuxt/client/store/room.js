var params = {
    TableName: 'room',
}

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

    async getCue({commit}, roomId, newVideoId) {

        const response = await this.$axios.get('/room', {params: {"roomId": roomId, "newVideoId": newVideoId}})

        return response.data.videoCue
    },

    updateCue({commit}, roomId) {

        this.$axios.get('/room')
        // this.$axios.post('/api/updateCue', {"roomId": roomId})

        // return response.data.videoCue
    },

}

// export default {
//     namespaced: true,
//     state,
//     getters,
//     mutations,
//     actions
// }