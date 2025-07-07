const assert = require("node:assert");
const { test, after, beforeEach, describe } = require("node:test");
const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const helper = require("./test_helper");
const Blog = require("../models/blog");

const api = supertest(app);

describe("when initial blogs are saved", () => {
  beforeEach(async () => {
    await Blog.deleteMany({});

    //best using mongoose not map or foreach
    await Blog.insertMany(helper.initialBlogs);
  });

  test("blogs are returned as json", async () => {
    await api
      .get("/api/blogs")
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });

  test("all blogs are returned", async () => {
    const response = await api.get("/api/blogs");
    assert.strictEqual(response.body.length, helper.initialBlogs.length);
  });

  test("blog posts is named id, not _id", async () => {
    const response = await api.get("/api/blogs");

    const blog = response.body[0];
    assert.ok(blog.id, "Expected blog to have 'id' property");
    assert.strictEqual(
      blog._id,
      undefined,
      "Expected blog not to have '_id' property"
    );
  });

  describe("addition of a new note", () => {
    test("succeeds with valid data", async () => {
      const newBlog = {
        title: "Go To Statement Considered Harmful",
        author: "Edsger W. Dijkstra",
        url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
        likes: 5,
      };

      const token = await helper.getTokenForTestUser();

      await api
        .post("/api/blogs")
        .set("Authorization", `Bearer ${token}`)
        .send(newBlog)
        .expect(201)
        .expect("Content-Type", /application\/json/);

      const blogAtEnd = await helper.blogsInDb();
      assert.strictEqual(blogAtEnd.length, helper.initialBlogs.length + 1);

      const title = blogAtEnd.map((blog) => blog.title);
      assert(title.includes("Go To Statement Considered Harmful"));
    });

    test("missing likes data is set to default 0", async () => {
      const newBlog = {
        title: "Go To Statement Considered Harmful",
        author: "Edsger W. Dijkstra",
        url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
      };
      const token = await helper.getTokenForTestUser();
      const response = await api
        .post("/api/blogs")
        .set("Authorization", `Bearer ${token}`)
        .send(newBlog)
        .expect(201)
        .expect("Content-Type", /application\/json/);

      assert.strictEqual(response.body.likes, 0);
    });

    test("fails with status code 400 if data invalid", async () => {
      const newBlog = {
        author: "Edsger W. Dijkstra",
        likes: 1,
      };

      const token = await helper.getTokenForTestUser();

      await api
        .post("/api/blogs")
        .set("Authorization", `Bearer ${token}`)
        .send(newBlog)
        .expect(400);

      const blogAtEnd = await helper.blogsInDb();

      assert.strictEqual(blogAtEnd.length, helper.initialBlogs.length);
    });
  });

  describe("update an existing note", () => {
    test("succeeds with a status code 200 if likes is updated", async () => {
      const blogsAtStart = await helper.blogsInDb();
      const blogToUpdate = blogsAtStart[0];

      const newLikes = 17;

      const token = await helper.getTokenForTestUser();

      await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .set("Authorization", `Bearer ${token}`)
        .send({ likes: newLikes })
        .expect(200);

      const blogAtEnd = await helper.blogsInDb();

      const updated = blogAtEnd.find((blog) => blog.id === blogToUpdate.id);

      assert.equal(updated.likes, newLikes);
    });
  });

  describe("deletion of a note", () => {
    test("succeeds with status code 204 if id is valid", async () => {
      const token = await helper.getTokenForTestUser();
      const blogAtStart = await helper.blogsInDb();
      const blogToDelete = blogAtStart[0];

      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .set("Authorization", `Bearer ${token}`)
        .expect(204);

      const blogAtEnd = await helper.blogsInDb();

      const blogTitles = blogAtEnd.map((blog) => blog.title);
      assert(!blogTitles.includes(blogToDelete.title));
    });
  });
});

after(async () => {
  await mongoose.connection.close();
});
