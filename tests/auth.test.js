const User = require("../models/userModel");
const supertest = require("supertest");
const app = require("../app");
const mongoose = require("mongoose");
const { JsonWebTokenError } = require("jsonwebtoken");

require("dotenv").config({ path: "./config.env" });
jest.setTimeout(20000);
describe("Auth routes", () => {
  beforeAll(async () => {
    mongoose
      .connect(process.env.TEST_MONGO_URL, {
        useUnifiedTopology: true,
        useNewUrlParser: true,
      })
      .then(() => {
        console.log("DB connection successful!");
      })
      .catch((err) => {
        console.log("could not connect to MongoDB");
        console.log(err);
      });
  });
  beforeEach(async () => {
    await User.create({
      first_name: "olive",
      last_name: "christopher",
      email: "move@gmail.com",
      password: "winner28",
      passwordConfirm: "winner28",
    });
  });
  afterEach(async () => {
    await User.deleteMany();
  });
  afterAll(async () => {
    await User.deleteMany();
    await mongoose.connection.close();
  });
  it("should signup a new user", async () => {
    const response = await supertest(app)
      .post("/api/v1/users/signup")
      .set("Content-type", "application/json")
      .send({
        first_name: "olive",
        last_name: "christopher",
        email: "move@gmail.com",
        password: "winner28",
        passwordConfirm: "winner28",
      });
    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty("status", "success");
    expect(response.body).toHaveProperty("data");
    expect(response.body.data).toHaveProperty("user");
    expect(response.body.data.user).toHaveProperty("first_name", "test");
    expect(response.body.data.user).toHaveProperty("last_name", "test");
    expect(response.body.data.user).toHaveProperty("email", "move@gmail.com");
    expect(response.body.token).toBeTruthy();
    expect(response.body.data.user.password).toBeUndefined();
  });
  it("should login a user", async () => {
    const response = await supertest(app)
      .post("/api/v1/users/login")
      .set("Content-type", "application/json")
      .send({
        email: "move@gmail.com",
        password: "winner28",
      });
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("status", "success");
    expect(response.body).toHaveProperty("data");
    expect(response.body.data).toHaveProperty("user");
    expect(response.body.data.user).toHaveProperty("first_name", "test");
    expect(response.body.data.user).toHaveProperty("last_name", "test");
    expect(response.body).toHaveProperty("token");
  });
});