import { v4 } from "uuid";
import { S3 } from "aws-sdk";

const s3Client = new S3();

async function handler(event: any, context: any) {
  const buckets = await s3Client.listBuckets().promise();
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "Hello from TS lambda",
      id: v4(),
      buckets: buckets.Buckets,
    }),
  };
}

export { handler };
