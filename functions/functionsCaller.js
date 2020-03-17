const firebase_function = require('./firebase_function')
const firebase = require('firebase')
const functions = firebase_function.functions
const admin = firebase_function.admin
const request = require('request')
const project = admin.instanceId().app.options.projectId

firebase.initializeApp({
    projectId: project
})

// const { Logging } = require('@google-cloud/logging');
// const logging = new Logging()


// const moment = require('moment-timezone')
// moment.tz.setDefault("Asia/Tokyo");

const runtimeOpts = {
    timeoutSeconds: 60,
    memory: '256MB'
}  

// const now = moment().format('YYYY-MM-DD-HH:mm:ss')

module.exports = functions.runWith(runtimeOpts).pubsub.schedule('every 15 minutes').onRun(async (context) => {
    if(project != 'pulscreen-prod') {
        console.log('not prod:', project)
        return
    }

    
    const callFunctions = [
        'enteredRoom',
        'getVideoQueue',
        'joinRoom',
        'generateMeta'
    ]

    callFunctions.map(async name => {
        const region = name == 'generateMeta'? 'us-central1':'asia-northeast1'
        console.log(name)

        const options = {
            url: `https://${region}-${project}.cloudfunctions.net/${name}`,
            method: 'POST',
            json: true,
            body: {}
        }

        request(options)
    })

    console.log('run')

    return null
})