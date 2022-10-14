import { Contact, ContactDocument } from "../models/contactModel";
import { Request, Response } from "express";
import mongoose from "mongoose";

const ObjectId = mongoose.Types.ObjectId;

// Handle index actions
export function index(req: Request, res: Response) {
  Contact.find((err: Error, contacts: ContactDocument) => {
    if (err) {
      return res.status(405).json({
        status: "error",
        message: err,
      });
    }
    res.json({
      status: "success",
      message: "Contacts retrieved successfully",
      data: contacts,
    });
  });
}

// Handle create contact actions
export function newContact(req: Request, res: Response) {
  if (!(req.body.email && req.body.name)) {
    return res.status(405).json({
      status: "error",
      message: "email and name cannot be empty!",
    });
  }
  const newContact = new Contact();
  const { name, email, gender, phone } = req.body;
  newContact.name = name ? name : newContact.name;
  newContact.email = email;
  newContact.gender = gender;
  newContact.phone = phone;

  // save the contact and check for errors
  newContact.save((err) => {
    if (err)
      return res.status(500).json({
        status: "error",
        message: "Internal server error, cant save new contact",
      });
    res.status(201).json({
      status: "success",
      message: "New contact created!",
      data: newContact,
    });
  });
}

// Handle view contact info
export function view(req: Request, res: Response) {
  const requestId = req.params._id;
  const isValidId = ObjectId.isValid(requestId);
  if (isValidId) {
    Contact.findById(req.params._id, (err: Error, contact: ContactDocument) => {
      if (err)
        return res.status(405).send(err).json({
          status: "error",
          message: "Cant find contact!",
        });

      res.json({
        status: "success",
        message: "Contact details loading..",
        data: contact,
      });
    });
  } else {
    return res.status(405).json({
      status: "error",
      message: "not a valid id",
    });
  }
}

/*
  Need to safeguard against the cannot set header crap
  */

// Handle update contact info
export function update(req: Request, res: Response) {
  const requestId = req.params._id;
  const isValidId = ObjectId.isValid(requestId);
  if (isValidId) {
    Contact.findById(
      req.params._id,
      (err: Error, contactToUpdate: ContactDocument) => {
        if (err)
          return res.status(405).send(err).json({
            status: "error",
            message: "Cant find contact!",
          });
        contactToUpdate.name = req.body.name
          ? req.body.name
          : contactToUpdate.name;
        contactToUpdate.gender = req.body.gender
          ? req.body.gender
          : contactToUpdate.gender;
        contactToUpdate.email = req.body.email
          ? req.body.email
          : contactToUpdate.email;
        contactToUpdate.phone = req.body.phone
          ? req.body.phone
          : contactToUpdate.phone;
        // save the contact and check for errors
        contactToUpdate.save((err: Error) => {
          if (err)
            return res.status(500).json(err).json({
              status: "error",
              message: "Internal server error! Cant update",
            });
          res.json({
            status: "success",
            message: "Contact Info updated",
            data: contactToUpdate,
          });
        });
      }
    );
  } else {
    return res.status(405).json({
      status: "error",
      message: "invalid id",
    });
  }
}

// Handle delete contact
export function deleteContact(req: Request, res: Response) {
  const requestId = req.params._id;
  const isValidId = ObjectId.isValid(requestId);
  if (isValidId) {
    Contact.deleteOne(
      {
        _id: req.params._id,
      },
      (err: Error) => {
        if (err)
          return res.status(405).send(err).json({
            status: "error",
            message: "Cant find/delete contact",
          });
        res.json({
          status: "success",
          message: "Contact deleted",
        });
      }
    );
  } else {
    return res.status(405).json({
      status: "error",
      message: "invalid id",
    });
  }
}
