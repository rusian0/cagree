import firebase from "~/plugins/firebase.js"
const db = firebase.firestore();
const itemRef = db.collection('room')

export const state = () => ({
    room: null,
    roomId: null
})

export const getters = {
    // check: state => !! state.username,
    // username: state => state.username ? state.username : '',
    roomInfo: state => state.room
}

export const mutations = {
    // setUser (state, username){
        // state.username = username;
    // },
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

    async modifyMember({ dispatch, commit, state }, {memberId, action}) {

        const docRef = itemRef.doc(state.roomId)

        let response;

        if(action == 'join'){
            response = await docRef.update({room_member: firebase.firestore.FieldValue.arrayUnion(memberId)},)
        }
        else if (action == 'leave'){
            response = await docRef.update({room_member: firebase.firestore.FieldValue.arrayRemove(memberId)},)
        }

        return response
    },
    async clearMember({ dispatch, commit, state }) {

        let response;

        response = await itemRef.doc(state.roomId).update({room_member: []},)

        return response
    },

    async createRoom({dispatch, commit, state }, roomId){
        const docs = {
            video_queue: [],
            room_member: []
        }
        const response = await itemRef.add(docs)
        return response.id
    }

}
