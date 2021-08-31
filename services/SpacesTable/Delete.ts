import { DynamoDB } from "aws-sdk";
import {
  Context,
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
} from "aws-lambda";

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

  const spaceId = event.queryStringParameters?.[PRIMARY_KEY!];

  try {
    if (spaceId) {
      const deleteResult = await dbClient
        .delete({
          TableName: TABLE_NAME!,
          Key: {
            [PRIMARY_KEY!]: spaceId,
          },
          ReturnValues: "ALL_OLD",
        })
        .promise();
      result.body = JSON.stringify(deleteResult);
    }
  } catch (error) {
    result.body = error.message;
  }

  return result;
}

export { handler };
