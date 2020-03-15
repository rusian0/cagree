const firebase_function = require('./firebase_function')
const functions = firebase_function.functions


module.exports = functions.https.onRequest(async (req, res) => {
    const fs = require('fs')
    const jsdom = require('jsdom')
    const { JSDOM } = jsdom

    const defaultHtml = fs.readFileSync('./html/index.html')
    const dom = new JSDOM(defaultHtml)
    const { document } = dom.window;
    
    const doc = document

    const head = doc.head

    const ogUrl = doc.createElement('meta')
    ogUrl.setAttribute('property', 'og:url')
    ogUrl.setAttribute('content', 'https://pulscreen.com')
    head.appendChild(ogUrl)

    const ogTitle = doc.createElement('meta')
    ogTitle.setAttribute('property', 'og:title')
    ogTitle.setAttribute('content', 'PulScreen | Youtube動画のリアルタイム共有サービス')
    head.appendChild(ogTitle)

    const ogImage = doc.createElement('meta')
    ogImage.setAttribute('property', 'og:image')
    ogImage.setAttribute('content', 'https://firebasestorage.googleapis.com/v0/b/dev-pulscreen.appspot.com/o/common%2Fmain.jpg?alt=media&token=29aa58c1-0362-4a3b-ba12-7799853cc757')
    head.appendChild(ogImage)

    const ogDesc = doc.createElement('meta')
    ogDesc.setAttribute('property', 'og:description')
    ogDesc.setAttribute('content', '何台でも。何人でも。複数人で同じ動画を同じタイミングで視聴できる。YouTube動画のリアルタイム共有サービス「PulScreen(プルスクリーン)」')
    head.appendChild(ogDesc)

    const twitterCard = doc.createElement('meta')
    twitterCard.setAttribute('name', 'twitter:card')
    twitterCard.setAttribute('content', 'summary_large_image')
    head.appendChild(twitterCard)

    const twitterSite = doc.createElement('meta')
    twitterSite.setAttribute('name', 'twitter:site')
    twitterSite.setAttribute('content', '@Rusian0')
    head.appendChild(twitterSite)

    // const meta = document.querySelector('meta[data-hid="description"]')
    // meta.setAttribute('content', 'testdescription')
    
    res.send('<!doctype html>' + "\n" + doc.documentElement.outerHTML)
})