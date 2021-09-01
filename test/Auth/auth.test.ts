import { AuthService } from "./AuthService";
import { config } from "./config";

const authService = new AuthService();

(async () => {
  const user = await authService.login(
    config.TEST_USER_NAME,
    config.TEST_USER_PASSWORD
  );
  console.log(user);
})();
