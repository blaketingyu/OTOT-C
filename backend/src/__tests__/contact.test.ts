import mongoose from "mongoose";
import request from "supertest";
import createServer from "../createServer";
import * as ContactController from "../../controllers/contactController";
import supertest from "supertest";
import { MongoMemoryServer } from "mongodb-memory-server";
import { Mongoose } from "mongoose";

let validContactId = "";
let invalidContactId = "-1";
const app = createServer();

beforeAll(async () => {
  const mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoose.connection.close();
});

describe(`connection test`, () => {
  describe("GET", () => {
    test("Reachable?", async () => {
      const res = await request(app).get("/");
      expect(res.statusCode).toBe(200);
    });
  });
});

describe(`GET "/contacts"`, () => {
  test("should give me all contacts", async () => {
    const { statusCode, body } = await supertest(app).get("/api/contacts");
    expect(statusCode).toBe(200);
    expect(body.status).toBe("success");
    expect(body.message).toBe("Contacts retrieved successfully");
  });
});

describe("POST", () => {
  describe("invalid contact", () => {
    test("returns error", async () => {
      const res = await request(app).post("/api/contacts").send({
        name: "Dog",
        gender: "dog",
        phone: "dog",
      });

      expect(res.statusCode).toBe(405);
      expect(res.body.status).toBe("error");
      expect(res.body.message).toBe("email and name cannot be empty!");
    });
  });
});

describe("POST", () => {
  describe("Valid contact", () => {
    test("returns success", async () => {
      const res = await request(app).post("/api/contacts").send({
        name: "Dog",
        email: "dog",
        gender: "dog",
        phone: "dog",
      });
      validContactId = res.body.data._id;
      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe("success");
      expect(res.body.message).toBe("New contact created!");
      expect(res.body.data._id).toEqual(validContactId);
      expect(res.body.data.name).toEqual("Dog");
      expect(res.body.data.gender).toEqual("dog");
      expect(res.body.data.phone).toEqual("dog");
    });
  });
});

describe("PATCH", () => {
  describe("Valid contact", () => {
    test("returns success", async () => {
      const res = await request(app).patch(`/api/contacts/${validContactId}`);
      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe("success");
      expect(res.body.message).toBe("Contact details loading..");
      expect(res.body.data).not.toBeNull();
    });
  });
});

describe("PATCH", () => {
  describe("Invalid contact", () => {
    test("returns error", async () => {
      const res = await request(app).patch(`/api/contacts/${invalidContactId}`);
      expect(res.statusCode).toBe(405);
      expect(res.body.status).toBe("error");
      expect(res.body.message).toBe("not a valid id");
    });
  });
});

describe("PATCH", () => {
  describe("Valid contact", () => {
    test("returns success", async () => {
      const res = await request(app).patch(`/api/contacts/${validContactId}`);
      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe("success");
      expect(res.body.message).toBe("Contact details loading..");
    });
  });
});

describe("PUT", () => {
  describe("invalid contact", () => {
    test("returns error", async () => {
      const res = await request(app).put(`/api/contacts/${invalidContactId}`);
      expect(res.statusCode).toBe(405);
      expect(res.body.status).toBe("error");
      expect(res.body.message).toBe("invalid id");
    });
  });
});

describe("PUT", () => {
  describe("Valid contact", () => {
    test("returns success", async () => {
      const res = await request(app)
        .put(`/api/contacts/${validContactId}`)
        .send({
          name: "Cat",
        });
      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe("success");
      expect(res.body.message).toBe("Contact Info updated");
      expect(res.body.data._id).toEqual(validContactId);
      expect(res.body.data.name).toEqual("Cat");
      expect(res.body.data.gender).toEqual("dog");
      expect(res.body.data.phone).toEqual("dog");
    });
  });
});

describe("DELETE", () => {
  describe("invalid contact", () => {
    test("returns error", async () => {
      const res = await request(app).delete(
        `/api/contacts/${invalidContactId}`
      );
      expect(res.statusCode).toBe(405);
      expect(res.body.status).toBe("error");
      expect(res.body.message).toBe("invalid id");
    });
  });
});

describe("DELETE", () => {
  describe("Valid contact", () => {
    test("returns success", async () => {
      const res = await request(app).delete(`/api/contacts/${validContactId}`);
      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe("success");
      expect(res.body.message).toBe("Contact deleted");
    });
  });
});
