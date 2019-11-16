import firebase from "~/plugins/firebase.js"
const db = firebase.firestore();
const itemRef = db.collection('room')

export default  async function ({ store, redirect, query }) {
  const roomId = query.id || 'testroomid'

  const room = await itemRef.doc(roomId).get()

  if (!room.exists) {
    return redirect('/')
  }

}