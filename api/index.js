const express = require("express")
const app = express()
const AWS = require('aws-sdk')

AWS.config.update({
    credentials: new AWS.Credentials(
        "acesskey",
        "secretkey"
      ),
      region: "dynamo-admin:8002"
  })

const dynamodb = new AWS.DynamoDB({ endpoint: new AWS.Endpoint('http://dynamo-admin:8002') })

app.get("/", function(req, res) {

    dynamodb.listTables(function(err, data){
        res.send(data)
    })

});

module.exports = {
    path: "/api/",
    handler: app
};