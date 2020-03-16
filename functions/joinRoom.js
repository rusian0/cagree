const firebase_function = require('./firebase_function')
const moment = require('moment-timezone')
moment.tz.setDefault("Asia/Tokyo");

const db = firebase_function.db
const functions = firebase_function.functions

const now = moment().format('YYYY-MM-DD-HH:mm:ss')

const runtimeOpts = {
    timeoutSeconds: 60,
    memory: '2GB'
}  

module.exports = functions.region('asia-northeast1').runWith(runtimeOpts).https.onCall(async (data, context) => {
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

    const roomCol = db.collection('room')
    const roomDocRef = roomCol.doc(auth.uid)
    const roomDoc = await roomDocRef.get()

    // このユーザーの部屋が既に作成されているか確認
    if(roomDoc.exists) {
        return { 
            roomId: auth.uid,
            beginner: false
        }
    }

    // 部屋作成
    await roomCol.doc(auth.uid).set({ 
        createdAt: now,
        video_queue:[
            'WJzSBLCaKc8',
            '8rRhLmhIFDI',
            's9JnNUFqXJA',
            'kX5FkzCjNrk',
            'FTrSmDKT0sM',
            'e9mKp1npBhY',
            '1E2y6834kYM'
        ],
    })

    return { 
        roomId: auth.uid,
        beginner: true
    }
});