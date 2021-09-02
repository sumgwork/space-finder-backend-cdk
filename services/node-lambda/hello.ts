import { APIGatewayProxyEvent } from "aws-lambda";
import { S3 } from "aws-sdk";

const s3Client = new S3();

async function handler(event: APIGatewayProxyEvent, context: any) {
  const buckets = await s3Client.listBuckets().promise();
  if (isAdmin(event)) {
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "You are authorized!! 😄 ",
        buckets: buckets.Buckets,
      }),
    };
  } else {
    return {
      statusCode: 401,
      body: JSON.stringify({
        message: "💢 You are unauthorized 💢",
      }),
    };
  }
}

function isAdmin(event: APIGatewayProxyEvent): boolean {
  const groups = event.requestContext.authorizer?.claims["cognito:groups"];
  if (groups) {
    return (groups as string).includes("admins");
  } else {
    return false;
  }
}

export { handler };
