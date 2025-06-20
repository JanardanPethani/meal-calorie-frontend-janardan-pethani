import request from "supertest";
import mongoose from "mongoose";
import app from "../server.js";
import User from "../models/User.js";

let token;
let userId;

// Setup before tests
beforeAll(async () => {
  // Create a test user
  const userData = {
    firstName: "Test",
    lastName: "User",
    email: "test@example.com",
    password: "Password123!",
  };

  // wait for DB connection
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Register the user
  const registerResponse = await request(app)
    .post("/auth/register")
    .send(userData);

  // Login to get token
  const loginResponse = await request(app).post("/auth/login").send({
    email: userData.email,
    password: userData.password,
  });

  token = loginResponse.body.user.token;
  userId = loginResponse.body.user.id;
});

// Clean up after tests
afterAll(async () => {
  // Delete test user
  await User.findByIdAndDelete(userId);

  // Close MongoDB connection
  await mongoose.connection.close();
});

describe("Calorie API Tests", () => {
  // Test common dishes
  test("Should return calories for macaroni and cheese", async () => {
    const response = await request(app)
      .post("/get-calories")
      .set("Authorization", `Bearer ${token}`)
      .send({
        dish_name: "macaroni and cheese",
        servings: 1,
      });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.dish_name).toMatch(/macaroni and cheese/i);
    expect(response.body.servings).toBe(1);
    expect(response.body.calories_per_serving).toBeGreaterThan(0);
    expect(response.body.total_calories).toBeGreaterThan(0);
  });

  test("Should return calories for grilled salmon", async () => {
    const response = await request(app)
      .post("/get-calories")
      .set("Authorization", `Bearer ${token}`)
      .send({
        dish_name: "grilled salmon",
        servings: 2,
      });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.dish_name).toMatch(/grilled salmon/i);
    expect(response.body.servings).toBe(2);
    expect(response.body.calories_per_serving).toBeGreaterThan(0);
    expect(response.body.total_calories).toBeGreaterThan(0);
  });

  test("Should return calories for paneer butter masala", async () => {
    const response = await request(app)
      .post("/get-calories")
      .set("Authorization", `Bearer ${token}`)
      .send({
        dish_name: "paneer butter masala",
        servings: 1,
      });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.dish_name).toMatch(/paneer butter masala/i);
    expect(response.body.servings).toBe(1);
    expect(response.body.calories_per_serving).toBeGreaterThan(0);
    expect(response.body.total_calories).toBeGreaterThan(0);
  });

  // Test non-existent dish
  test("Should return 404 for non-existent dish", async () => {
    const response = await request(app)
      .post("/get-calories")
      .set("Authorization", `Bearer ${token}`)
      .send({
        dish_name: "xyznonexistentfood123",
        servings: 1,
      });

    expect(response.status).toBe(404);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("Dish not found");
  });

  // Test invalid servings
  test("Should return 400 for zero servings", async () => {
    const response = await request(app)
      .post("/get-calories")
      .set("Authorization", `Bearer ${token}`)
      .send({
        dish_name: "pizza",
        servings: 0,
      });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("Valid number of servings is required");
  });

  test("Should return 400 for negative servings", async () => {
    const response = await request(app)
      .post("/get-calories")
      .set("Authorization", `Bearer ${token}`)
      .send({
        dish_name: "pizza",
        servings: -2,
      });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("Valid number of servings is required");
  });

  // Test search history
  test("Should save and retrieve search history", async () => {
    // First make a calorie search
    await request(app)
      .post("/get-calories")
      .set("Authorization", `Bearer ${token}`)
      .send({
        dish_name: "pizza",
        servings: 1,
      });

    // Then get search history
    const response = await request(app)
      .get("/search-history")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(Array.isArray(response.body.history)).toBe(true);
    expect(response.body.history.length).toBeGreaterThan(0);
  });
});
