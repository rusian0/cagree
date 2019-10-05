const AWS = require('aws-sdk')

class DynamoDBClient {
    constructor(tableName) {
        const endpoint = 'http://dynamo-admin:8002';
        // const endpoint = process.env.DYNAMODB_ENDPOINT;
        const config = endpoint !== "" ? { endpoint } : { region: 'dynamo-admin:8002' };
        // const config = endpoint !== "" ? { endpoint } : { region: process.env.DYNAMODB_REGION };
    
        this.documentClient = new AWS.DynamoDB.DocumentClient(config);
        this.tableName = 'room';
    }
    
    // scan() {
    //     return this.documentClient.sccdan({ TableName: this.tableName }).promise();
    // }

    getCue(){
        // return this.documentClient.get({ TableName: this.tableName, Key:{'id':'testroomid'} }).promise()
        return 'test'
    }
}

exports.DynamoDBClient = DynamoDBClient;