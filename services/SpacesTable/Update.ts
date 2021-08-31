import { DynamoDB } from "aws-sdk";
import {
  Context,
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
} from "aws-lambda";
import { getEventBody } from "../shared/utils";

const dbClient = new DynamoDB.DocumentClient();

const TABLE_NAME = process.env.TABLE_NAME;
const PRIMARY_KEY = process.env.PRIMARY_KEY;

async function handler(
  event: APIGatewayProxyEvent,
  _context: Context
): Promise<APIGatewayProxyResult> {
  const result: APIGatewayProxyResult = {
    statusCode: 200,
    body: "",
  };

  const requestBody = getEventBody(event);
  const spaceId = event.queryStringParameters?.[PRIMARY_KEY!];

  try {
    if (requestBody && spaceId) {
      const requestBodyKey = Object.keys(requestBody)[0];
      const requestBodyValue = requestBody[requestBodyKey];
      const updateResult = await dbClient
        .update({
          TableName: TABLE_NAME!,
          Key: {
            [PRIMARY_KEY!]: spaceId,
          },
          UpdateExpression: "set #keyNew = :valueNew",
          ExpressionAttributeNames: {
            "#keyNew": requestBodyKey,
          },
          ExpressionAttributeValues: {
            ":valueNew": requestBodyValue,
          },
          ReturnValues: "UPDATED_NEW",
        })
        .promise();
      result.body = JSON.stringify(updateResult);
    }
  } catch (error) {
    result.statusCode = 400;
    result.body = error.message;
  }

  return result;
}

export { handler };
