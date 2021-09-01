import Amplify, { Auth } from "aws-amplify";
import { config } from "./config";
import { CognitoUser } from "@aws-amplify/auth";

Amplify.configure({
  Auth: {
    mandatorySignIn: false,
    region: config.REGION,
    userPoolId: config.USER_POOL_ID,
    userPoolWebClientId: config.APP_CLIENT_ID,
    authenticationFlowType: "USER_PASSWORD_AUTH",
  },
});

export class AuthService {
  public async login(userName: string, password: string) {
    try {
      const user = (await Auth.signIn(userName, password)) as CognitoUser;
      return user;
    } catch (error) {
      console.log(error.message);
      return {};
    }
  }
}
