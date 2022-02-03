var AWSXRay = require("aws-xray-sdk");
var AWS = AWSXRay.captureAWS(require("aws-sdk"));
var documentClient = new AWS.DynamoDB.DocumentClient({
  apiVersion: "2012-08-10",
});

const tableName = "Cards";

exports.handler = async (event) => {
  var segment = AWSXRay.getSegment();
  var subsegment = segment.addNewSubsegment("Main Logic");
  subsegment.addAnnotation("App", "Kanban Lambda");

  console.log("Received:" + JSON.stringify(event, null, 2));

  let response = "";
  var params;

  try {
    const id = event.pathParameters.id;
    params = {
      TableName: tableName,
      Key: {
        id: id,
      },
    };
    await documentClient.delete(params).promise();

    response = {
      statusCode: 204,
      headers: {
        "Access-Control-allow-Origin": "*",
      },
    };
  } catch (exception) {
    console.error(exception);

    response = {
      statusCode: 500,
      headers: {
        "Access-Control-allow-Origin": "*",
      },
      body: JSON.stringify({ "Message: ": "서버 에러" }),
    };
    subsegment.addMetadata("Exception", exception.stack.toString());
    subsegment.addMetadata("Event", event);
    subsegment.addMetadata("Parameter", params);
    subsegment.close(exception);
  }
  subsegment.close();
  return response;
};
