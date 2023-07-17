const _ = require("lodash");

const dummy = (blogs) => {
  return 1;
};

const emptyList = (blogs) => {
  return "";
};

const totalLikes = (blogs) => {
  let sum = 0;
  blogs.forEach((blog) => (sum = sum + blog.likes));
  return sum;
};

const favoriteBlog = (blogs) => {
  const mostLiked = blogs.reduce((mostLiked, currentBlog) =>
    mostLiked.likes > currentBlog.likes
      ? {
          title: mostLiked.title,
          author: mostLiked.author,
          likes: mostLiked.likes,
        }
      : {
          title: currentBlog.title,
          author: currentBlog.author,
          likes: currentBlog.likes,
        }
  );
  return mostLiked;
};

const mostBlogs = (blogs) => {
  let highestAuthor = "";
  let blogsPosted = 0;
  const bloggers = _.countBy(blogs, (authorsBlogs) => authorsBlogs.author);

  _.forEach(bloggers, (value, key) => {
    if (value > blogsPosted) {
      blogsPosted = value;
      highestAuthor = key;
    }
  });

  return {
    author: highestAuthor,
    blogs: blogsPosted,
  };
};

const mostLikes = (blogs) => {
  let highestAuthor = "";
  let highestLikes = 0;
  const bloggers = _.groupBy(blogs, (authorsName) => authorsName.author);

  _.forEach(bloggers, (value, key) => {
    const totalLikes = _.sumBy(value, "likes");
    if (totalLikes > highestLikes) {
      highestLikes = totalLikes;
      highestAuthor = key;
    }
  });

  return {
    author: highestAuthor,
    likes: highestLikes,
  };
};

module.exports = {
  dummy,
  emptyList,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
};
