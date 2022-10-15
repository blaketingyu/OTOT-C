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

apiRoutes
  .route("/admin-only")
  .get(AuthController.AuthenticateTokenAdmin, AuthController.adminOnly);
apiRoutes
  .route("/user-admin")
  .get(AuthController.AuthenticateTokenUser, AuthController.userAndAdmin);

apiRoutes.route("/accesstoken").post(AuthController.getAccessToken);
