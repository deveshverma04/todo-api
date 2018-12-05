require("./config/config");

const _ = require("lodash");
var express = require("express");
var bodyParser = require("body-parser");
var { ObjectID } = require("mongodb");

var { mongoose } = require("./db/mongoose"); //ES6 destructuring
var { Todo } = require("./models/todo");
var { User } = require("./models/user");

var app = express();
const port = process.env.PORT;

app.use(bodyParser.json());

app.post("/todos", (req, res) => {
  var todo = new Todo(req.body);
  todo.save().then(
    result => {
      res.send(result);
    },
    e => {
      res.status(400).send(e);
    }
  );
});

app.get("/todos", (req, res) => {
  Todo.find().then(
    todos => {
      res.send(todos);
    },
    e => res.status(400).send(e)
  );
});

app.get("/todos/:id", (req, res) => {
  if (!ObjectID.isValid(req.params.id)) {
    return res.status(404).send("ID is not valid");
  }
  Todo.findById(req.params.id).then(
    todo => {
      if (!todo) {
        return res.status(404).send("ID not found");
      }

      res.send({ todo });
    },
    e => {
      res.status(400).send();
    }
  );
});

app.delete("/todos/:id", (req, res) => {
  var id = req.params.id;

  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  Todo.findByIdAndDelete(id)
    .then(todo => {
      if (!todo) {
        return res.status(404).send();
      }

      return res.status(200).send(todo);
    })
    .catch(e => {
      return res.status(400).send();
    });
});

app.patch("/todos/:id", (req, res) => {
  var id = req.params.id;
  var body = _.pick(req.body, ["text", "completed"]);
  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  if (_.isBoolean(body.completed) && body.completed) {
    body.completedAt = new Date().getTime();
  } else {
    body.completed = false;
    body.completedAt = null;
  }

  Todo.findByIdAndUpdate(id, { $set: body }, { new: true })
    .then(todo => {
      if (!todo) {
        return res.status(404).send();
      }
      res.send({ todo });
    })
    .catch(e => {
      return res.status(404).send();
    });
});

app.listen(port, () => {
  console.log(`Started on port ${port}`);
  console.log("----------------------------\n");
});

module.exports = { app };
