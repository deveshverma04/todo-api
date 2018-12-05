const {mongoose} = require('../server/db/mongoose');
const {Todo} = require('../server/models/todo');

var id = '5c066c84774ee84a4811b36d';

Todo.find({
    _id: id
}).then((todos) => console.log('Todos ', todos));

Todo.findOne({
    _id: id
}).then((todo) => console.log('Todo ', todo));

Todo.findById(id).then((todo) => console.log('Todo by ID', todo));