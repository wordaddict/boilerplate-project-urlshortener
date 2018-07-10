const mongoose = require('mongoose');

const config = require('../config/config');

const counterSchema = new mongoose.Schema({
    _id: { type: String, required: false },
    count: { type: Number, default: 0 }
});

const Counter = mongoose.model('Counter', counterSchema);

const urlSchema = new mongoose.Schema({
    _id: {type: Number},
    url: '',
    created_at: ''
});

urlSchema.pre('save', (next) => {
    console.log('running pre-save');
    let doc = this;
    Counter.findByIdAndUpdate({
        _id: 'url_count',
    }, {
        $inc: { count: 1 }
    }, (err, counter) => {
        if(err) {
            return next(err);
        }
        console.log('counter', counter);
        console.log('counter count', counter.count);
        doc._id = counter.count;
        doc.created_at = new Date();
        console.log('doc', doc);
        next();
    });
});

const URL = mongoose.model('URL', urlSchema);

const connectionString = (!config.mongo.connection.username || !config.mongo.connection.password) ? `mongodb://${config.mongo.connection.host}:${config.mongo.connection.port}/${config.mongo.connection.dbProd}` : `mongodb://${config.mongo.connection.username}:${config.mongo.connection.password}@${config.mongo.connection.host}:${config.mongo.connection.port}/${config.mongo.connection.dbProd}`;
promise = mongoose.connect(connectionString, {
    useMongoClient: true
});
promise.then((db) => {
    console.log('connected!');
    URL.remove({},() => {
        console.log('URL collection removed');
    })
    Counter.remove({}, () => {
        console.log('Counter collection removed');
        let counter = new Counter({_id: 'url_count', count: 10000});
        counter.save((err) => {
            if(err) return console.error(err);
            console.log('counter inserted');
        });
    });
});

module.exports = URL;