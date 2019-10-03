const DynamoDB = require('./dynamodb-client')
const dbClient = new DynamoDB.DynamoDBClient('Movie-Share');

exports.lambdaHandler = async (event, context) => {
    try {
    switch (event.httpMethod) {
        case "GET": {
            const dbOutput = await dbClient.scan();

            return {
                "statusCode": 200,
                "body": JSON.stringify(dbOutput)
            }
        }
        case "PUT": {
        return {
            "statusCode": 200,
            "body": JSON.stringify({})
        };
        }
        default:
        return {
            "statusCode": 501
        };
    }
    } catch (err) {
        console.log(err);
        return err;
    }
};