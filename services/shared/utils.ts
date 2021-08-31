import { APIGatewayProxyEvent } from "aws-lambda";

export const generateRandomId = () => Math.random().toString(36).slice(2);

export const getEventBody = (event: APIGatewayProxyEvent) =>
  typeof event.body === "object" ? event.body : JSON.parse(event.body);
