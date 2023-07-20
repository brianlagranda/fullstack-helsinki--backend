const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);

const Blog = require("../models/blog");

const initialBlogs = [
  {
    _id: "5a422a851b54a676234d17f7",
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
    __v: 0,
  },
  {
    _id: "5a422aa71b54a676234d17f8",
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
    __v: 0,
  },
];

beforeEach(async () => {
  await Blog.deleteMany({});
  let blogObject = new Blog(initialBlogs[0]);
  await blogObject.save();
  blogObject = new Blog(initialBlogs[1]);
  await blogObject.save();
});

describe("correct amount of blog posts", () => {
  test("all blog posts are returned", async () => {
    const response = await api.get("/api/blogs");

    expect(response.body).toHaveLength(initialBlogs.length);
  });

  test("a specific blog post is within the returned blogs", async () => {
    const response = await api.get("/api/blogs");

    const title = response.body.map((r) => r.title);
    expect(title).toContain("Go To Statement Considered Harmful");
  });
});

describe("unique identifier property of the blog posts is named id", () => {
  test("every blog posts id is defined", async () => {
    const response = await api.get("/api/blogs");

    const blogId = response.body.map((r) => r.id);
    expect(blogId).toBeDefined();
  });
});

describe("creating new blog post", () => {
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

    const response = await api.get("/api/blogs");

    const title = response.body.map((r) => r.title);

    expect(response.body).toHaveLength(initialBlogs.length + 1);
    expect(title).toContain("From my life");
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});
