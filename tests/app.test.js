// app.test.js
const express = require("express");
const request = require("supertest");

// Initialize MongoDB Memory Server
const MongodbMemoryServer = require("mongodb-memory-server").default;
const mongod = new MongodbMemoryServer();
const mongoose = require("mongoose");
const Author = require("../models/authorModel");
const Book = require("../models/bookModel");

const app = require("../app");

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

async function addFakeBook() { 
    const author = new Author({
        name: "johnHogg"
      });
    
      const savedAuthor = await author.save(); 
      
      const book1 = new Book({
      title: "paulo",
      author: `${savedAuthor._id}`
    });
  
    await book1.save();
  }

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

  // Add fake data to the DB to be used in the tests
  await addFakeAuthors();
  await addFakeBook()
});

test("GET /authors", async () => {
  const response = await request(app).get("/authors");

  expect(response.status).toBe(200);

  // Assert based on the fake data added
  expect(response.body.length).toBe(3);
});

test("Get /books should display all books", async () => {
    const response = await request(app).get("/books")
    
    expect(response.status).toBe(200)

    expect(response.body.length).toBe(1)
})

test("Get /books should display all books", async () => {
    const response = await request(app).get("/books")
    
    expect(response.status).toBe(200)

    expect(response.body.length).toBe(1)
})

test("Get / should display welcome message", async () => {
    const response = await request(app).get("/")
    
    expect(response.status).toBe(200)

    expect(response.body).toEqual({ message: "hello express-books-api" })
   // expect(response.body.message).toEqual({ "hello express-books-api")
})