const firebase_function = require('./firebase_function')
const moment = require('moment-timezone')
moment.tz.setDefault("Asia/Tokyo");

const db = firebase_function.db
const functions = firebase_function.functions

const now = moment().format('YYYY-MM-DD-HH:mm:ss')

module.exports = functions.https.onCall(async (data, context) => {
    const auth = context.auth ? context.auth : null

    if(auth === null || !auth.uid || auth.token.provider_id !== 'anonymous') return null

    console.log(data)
    console.log(context)

    return {data, context}
});