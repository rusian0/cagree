const firebase_function = require('./firebase_function')
const db = firebase_function.db
const functions = firebase_function.functions
const admin = firebase_function.admin

const moment = require('moment-timezone')
moment.tz.setDefault("Asia/Tokyo");

const now = moment().format('YYYY-MM-DD-HH:mm:ss')

module.exports = functions.https.onCall(async (data, context) => {
    
    const auth = context.auth ? context.auth : null
    
    if(auth === null || !auth.uid || auth.token.provider_id !== 'anonymous') return null
    
    const userPowerCol = db.collection('userPower')

    const userPowerDocRef = userPowerCol.doc(auth.uid)
    const userPowerDoc = await userPowerDocRef.get()

    // ユーザー権限の初期データが作成されていなければ作成
    if(!userPowerDoc.exists) {
        await userPowerDocRef.set({ 
            createdAt: now,
            ownerRooms: [auth.uid]
        })
    }
    else {
        userPowerDocRef.update({ ownerRooms: admin.firestore.FieldValue.arrayUnion(data.roomId) })
    }

    return null
})