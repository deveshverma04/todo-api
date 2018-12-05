var express = require('express');
var bodyParser = require('body-parser');
var {ObjectID} = require('mongodb');

var {mongoose} = require('./db/mongoose'); //ES6 destructuring
var {Todo} = require('./models/todo');
var {User} = require('./models/user');

var app = express();

app.use(bodyParser.json());

app.post('/todos', (req, res) => {
   
    var todo = new Todo(req.body);
    todo.save().then((result) => {
        console.log(result);        
        res.send(result);        
    }, (e) => {
        res.status(400).send(e);        
    });
});

app.get('/todos', (req, res) => {
    Todo.find().then((todos) => {
        res.send(todos);
    }, (e) => res.status(400).send(e));
});

app.get('/todos/:id', (req, res) => {
    if (!ObjectID.isValid(req.params.id)) {
        return res.status(404).send('ID is not valid');
    }
    Todo.findById(req.params.id).then((todo) => {
        if (!todo) {
            return res.status(404).send("ID not found");
        }

        res.send({todo});
    }, (e) => {
        res.status(400).send();
    });
});

app.listen(3000, () => {
    console.log('Started on port 3000');
});

module.exports = { app };