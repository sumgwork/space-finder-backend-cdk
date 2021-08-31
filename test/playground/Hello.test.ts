import { APIGatewayProxyEvent, Context } from "aws-lambda";
import { handler } from "../../services/SpacesTable/Delete";

const event: APIGatewayProxyEvent = {
  queryStringParameters: {
    spaceId: "f60812ff-928e-4d94-a3c6-138bcabe5695",
  },
} as any;

handler(event, {} as Context);
