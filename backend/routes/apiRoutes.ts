import { Router } from "express";
import * as ContactController from "../controllers/contactController";
import * as UserController from "../controllers/userController";
import * as AuthController from "../controllers/authController";

export const apiRoutes = Router();

apiRoutes.get("/", (req, res) => {
  res.json({
    status: "API Its Working",
    message: "Welcome to RESTHub crafted with love!",
  });
});

// Contact routes
apiRoutes
  .route("/contacts")
  .get(AuthController.AuthenticateTokenUser, ContactController.index)
  .post(AuthController.AuthenticateTokenUser, ContactController.newContact);

apiRoutes
  .route("/contacts/:_id")
  .patch(AuthController.AuthenticateTokenUser, ContactController.view)
  .put(AuthController.AuthenticateTokenUser, ContactController.update)
  .delete(
    AuthController.AuthenticateTokenAdmin,
    ContactController.deleteContact
  );

apiRoutes.route("/register/user").post(UserController.registerUser);
apiRoutes.route("/register/admin").post(UserController.registerAdmin);
apiRoutes.route("/signin").post(AuthController.signin);
apiRoutes.route("/signout").post(AuthController.signout);

//"accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IkRvZyIsInVzZXJQYXNzd29yZCI6IlNleGdvZCIsImlhdCI6MTY2NTc1MzU0MCwiZXhwIjoxNjY1NzU0MTQwfQ.PkFxP44tlZ834ANBFNT1xIzKUytog8E3Z6PxKFgRt7I",
//"refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IkRvZyIsInVzZXJQYXNzd29yZCI6IlNleGdvZCIsImlhdCI6MTY2NTc1MzU0MCwiZXhwIjoxNjY1NzU3MTQwfQ.u5OlJgfXA1EKH2go7rz-iRlAL2Ezo0JRte13aAsb2kg"
