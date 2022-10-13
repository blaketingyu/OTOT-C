import { Router } from "express";
import * as ContactController from "../controllers/contactController";

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
  .get(ContactController.index)
  .post(ContactController.newContact);

apiRoutes
  .route("/contacts/:_id")
  .patch(ContactController.view)
  .put(ContactController.update)
  .delete(ContactController.deleteContact);

