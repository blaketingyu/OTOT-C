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
  .get(AuthController.AuthenticateToken, ContactController.index)
  .post(AuthController.AuthenticateToken, ContactController.newContact);

apiRoutes
  .route("/contacts/:_id")
  .patch(ContactController.view)
  .put(ContactController.update)
  .delete(ContactController.deleteContact);

apiRoutes.route("/register/user").post(UserController.registerUser);
apiRoutes.route("/register/admin").post(UserController.registerUser);
apiRoutes.route("/signin").post(AuthController.signin);
