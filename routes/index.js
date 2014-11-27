var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  var m = getTestObject();
    m.save(function callback(err, m) {
        if (err) handleError(err);
        console.log(m);
        res.render('index', { title: 'Express' , m: m});
    });

});

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
mongoose.connect('mongodb://localhost/test');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
//    runKittens();
//    runBlog();
//    runAnimals();
//    runPersona();
    compileSchema();

});

function runKittens() {
    var kittySchema = mongoose.Schema({
        name: String
    })
    kittySchema.methods.speak = function () {
        var greeting = this.name
            ? "Meow name is " + this.name
            : "I don't have a name"
        console.log(greeting);
    }
    var Kitten = mongoose.model('Kitten', kittySchema)
    var silence = new Kitten({ name: 'Silence' })
    silence.save(function (err, silence) {
        if (err) return console.error(err);
        silence.speak();
    });
    var fluffy = new Kitten({ name: 'Fluffy' });
    fluffy.save(function (err, fluffy) {
        if (err) return console.error(err);
        fluffy.speak();
    });
    var callback = function (err, kittens) {
        if (err) return console.error(err);
        console.log(kittens)
    };
    Kitten.find(callback)
    Kitten.find({ name: /^Fluff/ }, callback)
}

function runBlog() {
    var blogSchema = new Schema({
        title:  String,
        author: String,
        body:   String,
        comments: [{ body: String, date: Date }],
        date: { type: Date, default: Date.now },
        hidden: Boolean,
        meta: {
            votes: Number,
            favs:  Number
        }
    });
    var Blog = mongoose.model('Blog', blogSchema);
}

//add methods to schema
function runAnimals() {

    // define a schema
    var animalSchema = new Schema({
        name: String,
        type: String,
        tags: { type: [String], index: true } // field level
    });

    // assign a function to the "methods" object of our animalSchema
    animalSchema.methods.findSimilarTypes = function (cb) {
        return this.model('Animal').find({ type: this.type }, cb);
    }
    var Animal = mongoose.model('Animal', animalSchema);
    var dog = new Animal({ type: 'dog' });
    dog.save(function(err, dog) {
        dog.findSimilarTypes(function (err, dogs) {
            console.log(dogs); // woof
        });
    });

    //this part cause error "has no method 'findByName'"

//    // assign a function to the "statics" object of our animalSchema
//    animalSchema.statics.findByName = function (name, cb) {
//        this.find({ name: new RegExp(name, 'i') }, cb);
//    }
//
//    var Animal = mongoose.model('Animal', animalSchema);
//    Animal.findByName('fido', function (err, animals) {
//        console.log(animals);
//    });

}

//virtual
function runPersona() {
    // define a schema
    var personSchema = new Schema({
        name: {
            first: String,
            last: String
        }
    });

    // compile our model
    var Person = mongoose.model('Person', personSchema);

    // create a document
    var bad = new Person({
        name: { first: 'Walter', last: 'White' }
    });

    personSchema.virtual('name.full').get(function () {
        return this.name.first + ' ' + this.name.last;
    });

    bad.save(function callback(err, obj) {
        console.log(obj);
    });
}

var schema;
function compileSchema() {
     schema = new Schema({
        name:    String,
        binary:  Buffer,
        living:  Boolean,
        updated: { type: Date, default: Date.now },
        age:     { type: Number, min: 18, max: 65 },
        mixed:   Schema.Types.Mixed,
        _someId: Schema.Types.ObjectId,
        array:      [],
        ofString:   [String],
        ofNumber:   [Number],
        ofDates:    [Date],
        ofBuffer:   [Buffer],
        ofBoolean:  [Boolean],
        ofMixed:    [Schema.Types.Mixed],
        ofObjectId: [Schema.Types.ObjectId],
        nested: {
            stuff: { type: String, lowercase: true, trim: true }
        }
    })
}

function getTestObject() {
    // example use
    var Thing = mongoose.model('Thing', schema);

    var m = new Thing;
    m.name = 'Statue of Liberty'
    m.age = 32;
    m.updated = new Date;
    m.binary = new Buffer(0);
    m.living = false;
    m.mixed = { any: { thing: 'i want' } };
    m.markModified('mixed');
    m._someId = new mongoose.Types.ObjectId;
    m.array.push(1);
    m.ofString.push("strings!");
    m.ofNumber.unshift(1,2,3,4);
//    m.ofDate.addToSet(new Date);
    m.ofBuffer.pop();
    m.ofMixed = [1, [], 'three', { four: 5 }];
    m.nested.stuff = 'good';
return m;
}

function handleError(err) {
    return console.error(err);
}

module.exports = router;
