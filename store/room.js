import firebase from "~/plugins/firebase.js"
import { createBrotliCompress } from "zlib";
const db = firebase.firestore();
const itemRef = db.collection('room')

const tableName = 'room'

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

    async getQueue({ dispatch, commit, state }) {

        const response = await itemRef.doc(state.roomId).get()

        return response.data().video_queue
    },

    async modifyQueue({ dispatch, commit, state }, {newVideoIds}) {

        const response = await itemRef.doc(state.roomId).update({video_queue: newVideoIds})

        return response
    },

    async createRoom({dispatch, commit, state }, roomId){
        const response = await itemRef.add({video_queue: []})
        return response.id
    }

}


// export default {
//     namespaced: true,
//     state,
//     getters,
//     mutations,
//     actions
// }