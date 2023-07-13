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

module.exports = {
  dummy,
  emptyList,
  totalLikes,
};
