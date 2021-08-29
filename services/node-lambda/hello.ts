import { v4 } from "uuid";

async function handler(event: any, context: any) {
  return {
    statusCode: 200,
    body: {
      message: "Hello from TS lambda",
      id: v4(),
    },
  };
}

export { handler };
