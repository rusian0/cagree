const firebase_function = require('./firebase_function')

const db = firebase_function.db
const functions = firebase_function.functions

const runtimeOpts = {
    timeoutSeconds: 60,
    memory: '1GB'
}  

module.exports = functions.region('asia-northeast1').runWith(runtimeOpts).https.onCall(async (data, context) => {
    const auth = context.auth ? context.auth : null

    if(auth === null || !auth.uid || auth.token.provider_id !== 'anonymous') return null

    const roomCol = db.collection('room')

    const roomDocRef = roomCol.doc(data.roomId)
    const roomDoc = await roomDocRef.get()

    if(roomDoc.exists){
        return { video_queue: roomDoc.data().video_queue }
    }
    else {
        return { video_queue: ['WJzSBLCaKc8'] }
    }
});