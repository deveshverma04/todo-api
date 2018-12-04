const {MongoClient, ObjectID} = require('mongodb');

var obj = new ObjectID();
console.log(obj);


MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {
    if (err) {
        return console.log(`Unable to connect to Mongo DB server: ${err}`);
    } else {
        console.log('Connected to MongoDB server');
    }

    const db = client.db('TodoApp');

    // db.collection('Todos').insertOne({
    //     text: 'Something to do',
    //     completed: false
    // }, (err, result) => {
    //     if (err) {
    //         return console.log('Unable to insert todo', err);
    //     } else {
    //         console.log(JSON.stringify(result.ops, undefined, 2));
    //     }
    // });

    db.collection('Users').insertOne({
        name: 'Devesh Verma',
        age: 34,
        location: 'Noida'
    }, (err, result) => {
        if (err) {
            return console.log('Unable to insert record', err);
        } else {
            console.log(JSON.stringify(result.ops, undefined, 2));            
        }
    });
    
    client.close();
});