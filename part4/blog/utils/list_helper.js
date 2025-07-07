const lodash = require("lodash");

const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  return blogs.reduce((sum, curr) => sum + curr.likes, 0);
};

const favoriteBlog = (blogs) => {
  return blogs.reduce((prev, curr) => {
    return curr.likes > prev.likes ? curr : prev;
  }, blogs[0]);
};

const mostBlogs = (blogs) => {
  let maxBlogs = 0;
  let mostAuthor = "";
  const authorCount = {};
  for (const { author } of blogs) {
    authorCount[author]++ || (authorCount[author] = 1);
  }

  for (const author in authorCount) {
    if (authorCount[author] > maxBlogs) {
      maxBlogs = authorCount[author];
      mostAuthor = author;
    }
  }

  return { author: mostAuthor, blogs: maxBlogs };
};

const mBlogs = (blogs) => {
  const grouped = lodash.countBy(blogs, "author");
  const authorWithMost = lodash.maxBy(
    lodash.toPairs(grouped),
    ([, count]) => count
  );

  if (!authorWithMost) return null;

  return { author: authorWithMost[0], blogs: authorWithMost[1] };
};

const mostLikes = (blogs) => {
  return blogs.reduce((prev, curr) => {
    return curr.likes > prev.likes
      ? { author: curr.author, likes: curr.likes }
      : { author: prev.author, likes: prev.likes };
  }, blogs[0]);
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mBlogs,
  mostLikes,
};
