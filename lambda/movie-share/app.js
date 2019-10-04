const DynamoDB = require('./dynamodb-client')
const dbClient = new DynamoDB.DynamoDBClient('Movie-Share');

exports.lambdaHandler = async (event, context) => {
    try {
    switch (event.httpMethod) {
        case "GET": {
            const dbOutput = await dbClient.getCue();

            return {
                "statusCode": 200,
                "body": JSON.stringify(dbOutput),
                "headers": {"Access-Control-Allow-Origin": "*"}
            }
        }
        case "PUT": {
        return {
            "statusCode": 200,
            "body": JSON.stringify({}),
            "headers": {"Access-Control-Allow-Origin": "*"}
        };
        }
        default:
        return {
            "statusCode": 501,
            "headers": {"Access-Control-Allow-Origin": "*"}
        };
    }
    } catch (err) {
        console.log(err);
        return err;
    }
};