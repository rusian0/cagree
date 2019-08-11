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

module.exports = {
    path: "/api/",
    handler: app
};