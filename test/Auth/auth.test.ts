import { AuthService } from "./AuthService";
import { config } from "./config";
import * as AWS from "aws-sdk";
import { CognitoUser } from "amazon-cognito-identity-js";

const authService = new AuthService();

(async () => {
  const user = await authService.login(
    config.TEST_USER_NAME,
    config.TEST_USER_PASSWORD
  );
  await authService.getAwsTemporaryCreds(user);
  const someCredentials = AWS.config.credentials;
  // console.log(
  //   "🚀 ~ file: auth.test.ts ~ line 15 ~ someCredentials",
  //   someCredentials
  // );
})();
