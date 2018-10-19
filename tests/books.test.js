const express = require("express");
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
  
  async function addFakeAuthors() {
    const author1 = new Author({
      name: "paulo"
    });
  
    const savedAuthor = await author1.save();
  
    const author2 = new Author({
      name: "john"
    });
    await author2.save();
    const book1 = new Book({
        title: "namers",
        author: `${savedAuthor._id}`
      });
    
    const bookResult = await book1.save();
  }

  beforeEach(async () => {
    // Clean DB between test runs
    mongoose.connection.db.dropDatabase();
    await addFakeAuthors()
  });  

  test("POST /books should create new author", async () => {
    const author = await Author.find({name:"john"})
    requestBody = { title: "tester", author: `${author[0]._id}`};
    const response = await request(app).post("/books").send(requestBody);
  
    expect(response.status).toBe(201);
  
    // Assert based on the fake data added
    expect(response.body).toMatch(/tester/);
  });

  test("Delete /book successful", async () => {
    const response = await request(app).delete("/books/namers");
  
    expect(response.status).toBe(200);
  
    // Assert based on the fake data added
    expect(response.body).toMatch(/you have deleted book/);
  });

  test("Deleting /book over and over should return 404", async () => {
    const response1 = await request(app).delete("/books/namers");
    const response2 = await request(app).delete("/books/namers");

    expect(response1.status).toBe(200);
    expect(response2.status).toBe(404);
       // Assert based on the fake data added
    expect(response1.body).toMatch(/you have deleted book/);
    expect(response2.body).toMatch(/book not found/);
});

test("Put /books/:title should cause book to be renamed", async () => {
    requestBody = { title: "tester"};

    const response = await request(app).put("/books/namers").send(requestBody);
  
    expect(response.status).toBe(200);
  
    // Assert based on the fake data added
    expect(response.body).toMatchObject({"title":"tester"});
  });