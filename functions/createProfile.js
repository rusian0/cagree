const firebase_function = require('./firebase_function')
const moment = require('moment-timezone')
moment.tz.setDefault("Asia/Tokyo");

const db = firebase_function.db
const functions = firebase_function.functions

module.exports = functions.https.onCall(async (data, context) => {
    const auth = context.auth ? context.auth : null

    if(auth === null || !auth.uid || auth.token.provider_id !== 'anonymous') return null

    const profileCol = db.collection('profile')

    const profileDocRef = profileCol.doc(auth.uid)
    const profileDoc = await profileDocRef.get()
    if(profileDoc.exists) return null

    const now = moment().format('YYYY-MM-DD-HH:mm:ss')
    await profileDocRef.set({ createdAt: now })
    return auth
});