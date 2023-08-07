const mongoose = require("mongoose");
const supertest = require("supertest");
const helper = require("./test_helper");
const app = require("../app");
const api = supertest(app);

const Blog = require("../models/blog");
const User = require("../models/user");

let token = null;

beforeEach(async () => {
  await Blog.deleteMany({});
  await User.deleteMany({});

  const testUser = {
    username: "root2",
    name: "Superuser2",
    password: "testpassword2",
  };

  await api.post("/api/users").send(testUser);

  const loggedIn = await api.post("/api/login/").send({
    username: "root2",
    password: "testpassword2",
  });

  token = loggedIn.body.token;

  for (let blog of helper.initialBlogs) {
    let blogObject = new Blog(blog);
    await blogObject.save();
  }
});

describe("getting blogs", () => {
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
});

describe("addition of a new blog", () => {
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
      .set("Authorization", `Bearer ${token}`)
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

    const result = await api
      .post("/api/blogs")
      .send(newBlogPost)
      .set("Authorization", `Bearer ${token}`)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    expect(result.body.likes).toBe(0);
  });

  test("title or url missing", async () => {
    const newBlogPost = {
      _id: "5a422bc61b54a676234d17fc",
      author: "Robert C. Martin",
      url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
      __v: 0,
    };

    await api
      .post("/api/blogs")
      .send(newBlogPost)
      .set("Authorization", `Bearer ${token}`)
      .expect(400);

    const blogsAtEnd = await helper.blogsInDb();

    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length);
  });

  test("succeeds with status code 401 if a token is not provided", async () => {
    const newBlogPost = {
      _id: "5a422bc61b54a676234d17fc",
      title: "Type wars",
      author: "Robert C. Martin",
      url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
      likes: 120,
      __v: 0,
    };

    await api.post("/api/blogs").send(newBlogPost).expect(401);
  });
});

describe("deletion of a blog", () => {
  test("succeeds with status code 204 if id is valid", async () => {
    const blogsAtStart = await helper.blogsInDb();
    const blogToDelete = blogsAtStart[0];

    await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204);

    const blogsAtEnd = await helper.blogsInDb();

    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length - 1);

    const titles = blogsAtEnd.map((r) => r.title);

    expect(titles).not.toContain(blogToDelete.title);
  });
});

describe("updating a blog", () => {
  test("succeeds with status code 202 if id is valid", async () => {
    const blogsAtStart = await helper.blogsInDb();
    const blogToUpdate = blogsAtStart[0];

    const updatedBlog = {
      ...blogToUpdate,
      likes: blogToUpdate.likes + 1,
    };

    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(updatedBlog)
      .expect(204);

    console.log(updatedBlog);

    const blogsAtEnd = await helper.blogsInDb();

    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length);

    const updatedBlogInDb = blogsAtEnd.find(
      (blog) => blog.id === blogToUpdate.id
    );

    console.log(updatedBlogInDb);
    expect(updatedBlogInDb.likes).toBe(blogToUpdate.likes + 1);
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});
