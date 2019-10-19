
var tableName = 'room'

const config = {headers: {
    'x-api-key': process.env.GATEWAY_API_KEY
}}

export const state = () => ({
    room: null,
    roomId: null
})

export const getters = {
    check: state => !! state.username,
    username: state => state.username ? state.username : '',
    roomInfo: state => state.room
}

export const mutations = {
    setUser (state, username){
        state.username = username;
    },
    setRoomInfo (state, roomInfo){
        state.room = roomInfo
    },
    setRoomId (state, roomId){
        state.roomId = roomId
    }
}

export const actions = {

    async getQueue(context) {

        var params = {
            select: "videoQueue"
        }

        const response = await this.$axios.get(`/model/${tableName}/${context.state.roomId}`, {params})

        return response.data.videoQueue
    },

    async modifyQueue(context, params) {

        const response = await this.$axios.put(`/model/${tableName}/${context.state.roomId}`, params, config)

        return response.data
    },

}


// export default {
//     namespaced: true,
//     state,
//     getters,
//     mutations,
//     actions
// }