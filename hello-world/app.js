const AWS = require("aws-sdk");
const dynamo_doc_client = new AWS.DynamoDB.DocumentClient();

exports.addMessage = async (event, context) => {
  try {
    const body = JSON.parse(event.body);
    await dynamo_doc_client
      .put({
        TableName: process.env.MessagesTableName,
        Item: {
          ListId: "tc-iac",
          Time: new Date().getTime(),
          Message: body
        }
      })
      .promise();
    return generateResponse(200);
  } catch (err) {
    generateResponse(502, err.message);
  }
};

exports.getMessages = async (event, context) => {
  try {
    let resp = await dynamo_doc_client
      .scan({ TableName: process.env.MessagesTableName })
      .promise();
    return generateResponse(200, resp.Items.map(it => it.Message));
  } catch (err) {
    generateResponse(502, err.message);
  }
};

function generateResponse(code, body) {
  return {
    statusCode: code,
    body: JSON.stringify(body),
    isBase64Encoded: false,
    headers: {
      "Access-Control-Allow-Origin": "http://lvh.me:3000",
      "Access-Control-Allow-Methods": "GET, POST"
    }
  };
}
