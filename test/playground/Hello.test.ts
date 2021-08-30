import { APIGatewayProxyEvent, Context } from "aws-lambda";
import { handler } from "../../services/SpacesTable/Create";

const event = {
  body: {
    location: "Sydney",
  },
};

handler(event as unknown as APIGatewayProxyEvent, {} as Context);
