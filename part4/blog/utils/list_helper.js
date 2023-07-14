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

module.exports = {
  dummy,
  emptyList,
  totalLikes,
  favoriteBlog,
};
