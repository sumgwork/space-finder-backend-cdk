import { DynamoDB } from "aws-sdk";
import {
  Context,
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
} from "aws-lambda";
import { v4 } from "uuid";

const dbClient = new DynamoDB.DocumentClient();

const TABLE_NAME = process.env.TABLE_NAME;

async function handler(
  event: APIGatewayProxyEvent,
  _context: Context
): Promise<APIGatewayProxyResult> {
  const result: APIGatewayProxyResult = {
    statusCode: 200,
    body: "",
  };

  const item =
    typeof event.body === "object" ? event.body : JSON.parse(event.body);
  item.spaceId = v4();

  try {
    await dbClient
      .put({
        TableName: TABLE_NAME!,
        Item: item,
      })
      .promise();
  } catch (error) {
    result.body = error.message;
  }
  result.body = JSON.stringify(item);

  return result;
}

export { handler };
