const express = require("express")
const app = express()
const AWS = require('aws-sdk')

const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

const table = 'room'

AWS.config.update({
    credentials: new AWS.Credentials(
        "acesskey",
        "secretkey"
    ),
    region: "dynamo-admin:8002"
})

const db = new AWS.DynamoDB.DocumentClient({ endpoint: new AWS.Endpoint('http://dynamo-admin:8002') });

app.get("/get_table", function(req, res) {

    var param = req.query;

    // res.send(get_param)
    // var param = {TableName: get_param.name}

    db.scan(param, function(err, data){
        if(err){
            res.send(err.message);
        }
        else{
            res.send(data.Items)
        }
    })

});

app.get("/getCue", function(req, res) {
    var params = {
        TableName: table,
        Key: {
            'id': req.query.roomId
        }
    }

    db.get(params, function(err, data){
        if(err){
            res.send(err.message);
        }
        else{
            res.send(data.Item)
        }
    })
})

app.post("/updateCue", function(req, res) {
    var input = req.body

    console.log(req.body)
    return
    var params = {
        TableName: table,
        Key: {
            'id': input.roomId
        },
        ExpressionAttributeNames: {
            '#vc': 'videoCue'
        },
        ExpressionAttributeValues:{
            ':addCueId': [input.newVideoId]
        },
        UpdateExpression: 'SET #vc = list_append(#vc, :addCueId)'
    }
    db.update(params, function(err, data){
        if(err){
            res.send(err.message);
        }
        else{
            res.send(data.Item)
        }

    })
})

module.exports = {
    path: "/api/",
    handler: app
};