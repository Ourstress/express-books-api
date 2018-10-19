const express = require("express");
const router = express.Router()
const request = require("supertest");
const app = require("../app");
// Initialize MongoDB Memory Server
const MongodbMemoryServer = require("mongodb-memory-server").default;
const mongod = new MongodbMemoryServer();
const mongoose = require("mongoose");
const Author = require("../models/authorModel");
const Book = require("../models/bookModel");

beforeAll(async () => {
    // Increase timeout to allow MongoDB Memory Server to be donwloaded
    // the first time
    jest.setTimeout(120000);
  
    const uri = await mongod.getConnectionString();
    await mongoose.connect(uri);
  });

afterAll(() => {
    mongoose.disconnect();
    mongod.stop();
  });
  
beforeEach(async () => {
    // Clean DB between test runs
    mongoose.connection.db.dropDatabase();
  });  

  async function addFakeAuthors() {
    const author1 = new Author({
      name: "paulo"
    });
  
    await author1.save();
  
    const author2 = new Author({
      name: "john"
    });
    await author2.save();
  }

  test("Get /authors/:id should create retrieve selected author", async () => {
    const author = new Author({
        name: "hohoyo"
      });
    const savedAuthor = await author.save() 
    const book1 = new Book({
        title: "paulo",
        author: `${savedAuthor._id}`
      });
    
    await book1.save();
    const response = await request(app).get(`/authors/${savedAuthor._id}`);
  
    expect(response.status).toBe(200);
  
    // Assert based on the fake data added
    expect(response.body.books[0]).toHaveProperty("title","paulo");
  });

test("Put /authors should create new author", async () => {
    const author = new Author({
            name: "johnHogg"
          });

    const savedAuthor = await author.save()
    
    requestBody = { name: "tester"};

    const response = await request(app).put("/authors/johnHogg").send(requestBody);
  
    expect(response.status).toBe(200);
  
    // Assert based on the fake data added
    expect(response.body.name).toMatch(/tester/);
  });

  test("Delete /authors should create new author", async () => {
    await addFakeAuthors()
    const response = await request(app).delete("/authors/paulo");
  
    expect(response.status).toBe(200);
  
    // Assert based on the fake data added
    expect(response.body).toMatch(/you have deleted author/);
  });

  test("Deleting /authors over and over should return 404", async () => {
    await addFakeAuthors()
    const response1 = await request(app).delete("/authors/paulo");
    const response2 = await request(app).delete("/authors/paulo");

    expect(response1.status).toBe(200);
    expect(response2.status).toBe(404);
  
    // Assert based on the fake data added
    expect(response1.body).toMatch(/you have deleted author/);
    expect(response2.body).toMatch(/author not found/);
  });
  
  test("POST /authors should create new author", async () => {
    requestBody = { name: "tester"};

    const response = await request(app).post("/authors").send(requestBody);
  
    expect(response.status).toBe(201);
  
    // Assert based on the fake data added
    expect(response.body).toMatch(/new author added/);
  });

  test("GET /authors", async () => {
    await addFakeAuthors()
    const response = await request(app).get("/authors");
  
    expect(response.status).toBe(200);
  
    // Assert based on the fake data added
    expect(response.body.length).toBe(2);
  });