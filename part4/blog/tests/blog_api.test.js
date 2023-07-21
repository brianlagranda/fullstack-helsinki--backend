const mongoose = require("mongoose");
const supertest = require("supertest");
const helper = require("./test_helper");
const app = require("../app");
const api = supertest(app);

const Blog = require("../models/blog");

beforeEach(async () => {
  await Blog.deleteMany({});

  let blogObject = new Blog(helper.initialBlogs[0]);
  await blogObject.save();

  blogObject = new Blog(helper.initialBlogs[1]);
  await blogObject.save();
});

test("all blog posts are returned", async () => {
  const response = await api.get("/api/blogs");

  expect(response.body).toHaveLength(helper.initialBlogs.length);
});

test("a specific blog post is within the returned blogs", async () => {
  const response = await api.get("/api/blogs");

  const title = response.body.map((r) => r.title);
  expect(title).toContain("Go To Statement Considered Harmful");
});

test("every blog posts unique identifier is named id", async () => {
  const response = await api.get("/api/blogs");

  const blogId = response.body.map((r) => r.id);
  expect(blogId).toBeDefined();
});

test("a valid blog post can be added", async () => {
  const newBlogPost = {
    _id: "5a422bc61b54a676234d17fe",
    title: "From my life",
    author: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/users/EWD/ewd11xx/EWD1166.PDF",
    likes: 0,
    __v: 0,
  };

  await api
    .post("/api/blogs")
    .send(newBlogPost)
    .expect(201)
    .expect("Content-Type", /application\/json/);

  const blogsAtEnd = await helper.blogsInDb();
  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1);

  const title = blogsAtEnd.map((r) => r.title);
  expect(title).toContain("From my life");
});

test("blog posts added with no likes by default will have zero likes", async () => {
  const newBlogPost = {
    _id: "5a422bc61b54a676234d17fc",
    title: "Type wars",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
    __v: 0,
  };

  await api
    .post("/api/blogs")
    .send(newBlogPost)
    .expect(201)
    .expect("Content-Type", /application\/json/);

  const blogsAtEnd = await helper.blogsInDb();

  console.log(blogsAtEnd[-1]["likes"]);

  expect(blogsAtEnd[-1]["likes"]).toBe(0);
});

test("if the title or url are missing", async () => {
  const newBlogPost = {
    _id: "5a422bc61b54a676234d17fc",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
    __v: 0,
  };

  await api.post("/api/blogs").send(newBlogPost).expect(400);

  const blogsAtEnd = await helper.blogsInDb();

  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length);
});

afterAll(async () => {
  await mongoose.connection.close();
});
