import { APIGatewayProxyEvent, Context } from "aws-lambda";
import { handler } from "../../services/SpacesTable/Create";

const event: APIGatewayProxyEvent = {
  body: {
    name: "abc",
  },
} as any;

handler(event, {} as Context);
