import { APIGatewayProxyEvent, Context } from "aws-lambda";
import { handler } from "../../services/SpacesTable/Read";

const event: APIGatewayProxyEvent = {
  queryStringParameters: {
    location: "London",
  },
} as any;

handler(event, {} as Context);
