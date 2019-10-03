const AWS = require('aws-sdk')

class DynamoDBClient {
    constructor(tableName) {
        // const endpoint = 'http://172.29.0.3:8002';
        const endpoint = process.env.DYNAMODB_ENDPOINT;
        // const config = endpoint !== "" ? { endpoint } : { region: '172.29.0.3:8002' };
        const config = endpoint !== "" ? { endpoint } : { region: process.env.DYNAMODB_REGION };
    
        this.documentClient = new AWS.DynamoDB.DocumentClient(config);
        this.tableName = 'room';
    }
    
    scan() {
        return this.documentClient.scan({ TableName: this.tableName }).promise();
    }
}

exports.DynamoDBClient = DynamoDBClient;