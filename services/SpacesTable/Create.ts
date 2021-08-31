import { DynamoDB } from "aws-sdk";
import {
  Context,
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
} from "aws-lambda";
import {
  MissingFieldError,
  validateAsSpaceEntry,
} from "../shared/inputValidator";
import { generateRandomId } from "../shared/utils";

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

  try {
    const item = getEventBody(event);
    item.spaceId = generateRandomId();

    validateAsSpaceEntry(item);

    await dbClient
      .put({
        TableName: TABLE_NAME!,
        Item: item,
      })
      .promise();
    result.body = JSON.stringify(item);
  } catch (error) {
    if (error instanceof MissingFieldError) {
      result.statusCode = 400;
    } else {
      result.statusCode = 500;
    }
    result.body = error.message;
  }

  return result;
}

export { handler };
