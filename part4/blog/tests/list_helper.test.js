const listHelper = require("../utils/list_helper");

const listWithOneBlog = [
  {
    _id: "64b01ec22d35c5045114f0b2",
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
    __v: 0,
  },
];

const listWithBlogs = [
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
  {
    _id: "5a422b3a1b54a676234d17f9",
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    likes: 12,
    __v: 0,
  },
  {
    _id: "5a422b891b54a676234d17fa",
    title: "First class tests",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
    likes: 12,
    __v: 0,
  },
  {
    _id: "5a422ba71b54a676234d17fb",
    title: "TDD harms architecture",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
    likes: 0,
    __v: 0,
  },
  {
    _id: "5a422bc61b54a676234d17fc",
    title: "Type wars",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
    likes: 2,
    __v: 0,
  },
  {
    _id: "5a422bc61b54a676234d17fe",
    title: "From my life",
    author: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/users/EWD/ewd11xx/EWD1166.PDF",
    likes: 0,
    __v: 0,
  },
];

test("dummy returns 1", () => {
  const blogs = [];

  const result = listHelper.dummy(blogs);
  expect(result).toBe(1);
});

describe("total likes", () => {
  const blogs = [];

  test("of empty list is zero", () => {
    const result = listHelper.emptyList(blogs);
    expect(result).toBe("");
  });

  test("when list has only one blog, equals the likes of that", () => {
    const result = listHelper.totalLikes(listWithOneBlog);
    expect(result).toBe(5);
  });

  test("of a bigger list is calculated right", () => {
    const result = listHelper.totalLikes(listWithBlogs);
    expect(result).toBe(38);
  });
});

describe("favorite blog", () => {
  test("if found 2 or more blogs with same properties", () => {
    const result = listHelper.favoriteBlog(listWithBlogs);
    const expected = {
      title: listWithBlogs[3].title,
      author: listWithBlogs[3].author,
      likes: listWithBlogs[3].likes,
    };
    expect(result).toEqual(expected);
  });
});

describe("author with most blogs", () => {
  test("if found 2 or more authors with same quantity of blogs", () => {
    const result = listHelper.mostBlogs(listWithBlogs);
    const expected = {
      author: "Edsger W. Dijkstra",
      blogs: 3,
    };
    expect(result).toEqual(expected);
  });
});

describe("author with most likes", () => {
  test("if found 2 or more authors with same quantity of likes", () => {
    const result = listHelper.mostLikes(listWithBlogs);
    const expected = {
      author: "Edsger W. Dijkstra",
      likes: 17,
    };
    expect(result).toEqual(expected);
  });
});
