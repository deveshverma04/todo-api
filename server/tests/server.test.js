const request = require('supertest');
const expect = require('expect');
const {ObjectID} = require('mongodb');

const {app} = require('../server');
const {Todo} = require('../models/todo');

const todos = [{_id: new ObjectID(), text: 'First todo'}, 
    {_id: new ObjectID(), text: 'Second todo'}, 
    {_id: new ObjectID(), text: 'Third todo'}];

beforeEach((done) => {
    Todo.remove({}).then(() => {
        return Todo.insertMany(todos);
    }).then(() => done());
});

describe('POST /todos', () => {

    it('should create a new todo', (done) => {
        var text = "Test todo text";

        request(app)
            .post('/todos')
            .send({text})
            .expect(200)
            .expect((res) => {
                expect(res.body.text).toBe(text);
            }).end((err, res) => {
                if (err) {
                    return done(err);
                }

                Todo.find({text}).then((todos) => {
                    expect(todos.length).toBe(1);
                    expect(todos[0].text).toBe(text)
                    done();
                }).catch((e) => done(e));
            });
    });

    it('should not create todo', (done) => {
        request(app)
            .post('/todos')
            .send({})
            .expect(400)
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                
                Todo.find().then((todos) => {
                    expect(todos.length).toBe(3);
                    done();
                }).catch((e) => done(e));
            });
    });
});

describe('GET /todos', () => {

    it('should get all todos', (done) => {
        request(app)
            .get('/todos')
            .expect(200)
            .expect((res) => {
                expect(res.body.length).toBe(3);
            }).end(done);
    });
});

describe('GET /todos/:id', () => {
var validId = 
    it('should get todo by ID', (done) => {
        request(app)
            .get(`/todos/${todos[0]._id}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(todos[0].text);
            }).end(done);
    });

    it('should return 404 if ID not found', (done) => {
        var incorrectID = new ObjectID().toHexString();
        console.log(incorrectID);
        request(app)
            .get(`/todos/${incorrectID}`)
            .expect(404)
            .end(done);
    });

    it('should return 404 if ID is invalid', (done) => {
        var incorrectID = '5c074dfcb2da35291c5888822';
        console.log(incorrectID);
        request(app)
            .get(`/todos/${incorrectID}`)
            .expect(404)
            .end(done);
    });
});