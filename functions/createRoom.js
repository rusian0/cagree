// const functions = require('firebase-functions');
// const admin = require('firebase-admin')
// admin.initializeApp()
// const db = admin.firestore()

const firebase_function = require('./firebase_function')

const db = firebase_function.db
const functions = firebase_function.functions


module.exports = functions.https.onCall(async (data, context) => {
    const roomCol = db.collection('room')
    const auth = context.auth ? context.auth : null

    if(auth === null || !auth.uid ||auth.token.provider_id !== 'anonymous') return null
    
    const myRoomDoc = await roomCol.where('author', '==', auth.uid).get()
    if(!myRoomDoc.exists) return null

    const myRooms = myRoomDoc.data()

    return myRooms
});