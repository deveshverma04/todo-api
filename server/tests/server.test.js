const request = require("supertest");
const expect = require("expect");
const { ObjectID } = require("mongodb");

const { app } = require("../server");
const { Todo } = require("../models/todo");

const todos = [
  { _id: new ObjectID(), text: "First todo" },
  { _id: new ObjectID(), text: "Second todo" },
  { _id: new ObjectID(), text: "Third todo" }
];

beforeEach(done => {
  Todo.deleteMany({})
    .then(() => {
      return Todo.insertMany(todos);
    })
    .then(() => done());
});

describe("POST /todos", () => {
  it("should create a new todo", done => {
    var text = "Test todo text";

    request(app)
      .post("/todos")
      .send({ text })
      .expect(200)
      .expect(res => {
        expect(res.body.text).toBe(text);
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Todo.find({ text })
          .then(todos => {
            expect(todos.length).toBe(1);
            expect(todos[0].text).toBe(text);
            done();
          })
          .catch(e => done(e));
      });
  });

  it("should not create todo", done => {
    request(app)
      .post("/todos")
      .send({})
      .expect(400)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Todo.find()
          .then(todos => {
            expect(todos.length).toBe(3);
            done();
          })
          .catch(e => done(e));
      });
  });
});

describe("GET /todos", () => {
  it("should get all todos", done => {
    request(app)
      .get("/todos")
      .expect(200)
      .expect(res => {
        expect(res.body.length).toBe(3);
      })
      .end(done);
  });
});

describe("GET /todos/:id", () => {
  var validId = it("should get todo by ID", done => {
    request(app)
      .get(`/todos/${todos[0]._id}`)
      .expect(200)
      .expect(res => {
        expect(res.body.todo.text).toBe(todos[0].text);
      })
      .end(done);
  });

  it("should return 404 if ID not found", done => {
    var incorrectID = new ObjectID().toHexString();
    request(app)
      .get(`/todos/${incorrectID}`)
      .expect(404)
      .end(done);
  });

  it("should return 404 if ID is invalid", done => {
    request(app)
      .get("/todos/abc123")
      .expect(404)
      .end(done);
  });
});

describe("DELETE /todos/:id", () => {
  it("should delete the record", done => {
    request(app)
      .delete(`/todos/${todos[0]._id}`)
      .expect(200)
      .expect(res => {
        expect(res.body._id).toBe(todos[0]._id.toHexString());
      })
      .end(done);
  });

  it("should get 404 if ID is invalid", done => {
    request(app)
      .delete(`/todos/abc123`)
      .expect(404)
      .end(done);
  });

  it("should get 404 if ID is non-existent", done => {
    var id = new ObjectID().toHexString();
    request(app)
      .delete(`/todos/${id}`)
      .expect(404)
      .end(done);
  });
});
