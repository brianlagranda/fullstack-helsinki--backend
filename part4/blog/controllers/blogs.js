const blogsRouter = require("express").Router();
const Blog = require("../models/blog");
require("express-async-errors");

blogsRouter.post("/", async (request, response) => {
  const body = request.body;

  const user = request.user;

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: user._id,
  });

  const savedBlog = await blog.save();
  user.blogs = user.blogs.concat(savedBlog._id);
  await user.save();

  response.status(201).json(savedBlog);
});

blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate("user", {
    username: 1,
    name: 1,
  });

  response.json(blogs).status(200);
});

blogsRouter.get("/:id", async (request, response) => {
  const blog = await Blog.findById(request.params.id);

  if (blog) {
    response.json(blog);
  } else {
    response.status(404).end();
  }
});

blogsRouter.put("/:id", async (request, response) => {
  const { id } = request.params;
  const updatedBlog = request.body;

  const updatedBlogResult = await Blog.findByIdAndUpdate(id, updatedBlog, {
    new: true,
  });

  if (updatedBlogResult) {
    response.status(204).end();
  } else {
    response.status(404).end();
  }
});

blogsRouter.delete("/:id", async (request, response) => {
  const user = request.user;

  const blog = await Blog.findById(request.params.id);

  if (blog.user.toString() === user.id.toString()) {
    await Blog.findByIdAndRemove(request.params.id);
    return response.status(204).end();
  } else {
    return response
      .status(401)
      .json({ error: "Unauthorized user. You may only delete your own blogs" });
  }
});

module.exports = blogsRouter;
