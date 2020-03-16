const firebase_function = require('./firebase_function')
const db = firebase_function.db
const functions = firebase_function.functions
const admin = firebase_function.admin

const moment = require('moment-timezone')
moment.tz.setDefault("Asia/Tokyo");

const runtimeOpts = {
    timeoutSeconds: 60,
    memory: '2GB'
}  

const now = moment().format('YYYY-MM-DD-HH:mm:ss')

module.exports = functions.region('asia-northeast1').runWith(runtimeOpts).https.onCall(async (data, context) => {
    
    const auth = context.auth ? context.auth : null

    console.log('auth check')
    
    if(auth === null || !auth.uid || auth.token.provider_id !== 'anonymous') {
        console.log('no auth')
        return 'no auth'
    }
    console.log('auth ok')
    const userPowerCol = db.collection('userPower')

    console.log('uid:', auth.uid)
    const userPowerDocRef = userPowerCol.doc(auth.uid)
    const userPowerDoc = await userPowerDocRef.get()

    console.log('add power')
    // ユーザー権限の初期データが作成されていなければ作成
    if(!userPowerDoc.exists) {
        await userPowerDocRef.set({ 
            createdAt: now,
            ownerRooms: [auth.uid]
        })
        console.log('add power doc')
    }

    console.log('powerdocData', userPowerDoc.data())
    userPowerDocRef.update({ ownerRooms: admin.firestore.FieldValue.arrayUnion(data.roomId) })
    console.log('update power doc')

    return 'done'
})