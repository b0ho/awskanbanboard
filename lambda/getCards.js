var AWSXRay = require("aws-xray-sdk");
var AWS = AWSXRay.captureAWS(require("aws-sdk"));
var documentClient = new AWS.DynamoDB.DocumentClient({
  apiVersion: "2012-08-10",
});

const tableName = "Cards";

exports.handler = async (event) => {
  console.log("Received:" + JSON.stringify(event, null, 2));

  let response = "";

  try {
    var params = {
      TableName: tableName,
    };
    const cards = await documentClient.scan(params).promise();

    response = {
      statusCode: 200,
      headers: {
        "Access-Control-allow-Origin": "*",
      },
      body: JSON.stringify(cards),
    };
  } catch (exception) {
    console.error(exception);

    response = {
      statusCode: 500,
      headers: {
        "Access-Control-allow-Origin": "*",
      },
      body: JSON.stringify({ "Message: ": exception }),
    };
  }
  return response;
};
