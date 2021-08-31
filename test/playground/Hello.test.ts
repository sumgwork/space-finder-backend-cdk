import { APIGatewayProxyEvent, Context } from "aws-lambda";
import { handler } from "../../services/SpacesTable/Read";

const event: APIGatewayProxyEvent = {
  queryStringParameters: {
    spaceId: "3b001bff-5d97-4ded-a917-9b72e770e70a",
  },
  // body: {
  //   location: "Paris",
  // },
} as any;

handler(event, {} as Context);
