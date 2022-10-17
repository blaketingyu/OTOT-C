import { Router } from "express";
import * as ContactController from "../controllers/contactController";
import * as UserController from "../controllers/userController";
import * as AuthController from "../controllers/authController";
import { ROLES } from "../controllers/userController";

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
  .get(AuthController.AuthenticateRole([ROLES.USER]), ContactController.index)
  .post(
    AuthController.AuthenticateRole([ROLES.USER]),
    ContactController.newContact
  );

apiRoutes
  .route("/contacts/:_id")
  .patch(AuthController.AuthenticateRole([ROLES.USER]), ContactController.view)
  .put(AuthController.AuthenticateRole([ROLES.USER]), ContactController.update)
  .delete(
    AuthController.AuthenticateRole([ROLES.ADMIN]),
    ContactController.deleteContact
  );

apiRoutes.route("/register/user").post(UserController.registerUser);
apiRoutes.route("/register/admin").post(UserController.registerAdmin);
apiRoutes.route("/signin").post(AuthController.signin);
apiRoutes.route("/signout").post(AuthController.signout);

apiRoutes
  .route("/admin-only")
  .get(
    AuthController.AuthenticateRole([ROLES.ADMIN]),
    AuthController.adminOnly
  );

apiRoutes
  .route("/accesstoken")
  .post(
    AuthController.AuthenticateRole([ROLES.USER]),
    AuthController.getAccessToken
  );
