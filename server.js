// call the packages we need
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');
var dataBase   = require('./app/models/notes.js');

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;        // set our port

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router

// middleware to use for all requests
router.use(function(req, res, next) {
    // do logging
    console.log('Something is happening.');
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
    res.setHeader("Access-Control-Allow-Methods","PUT, POST, GET, DELETE, PATCH, OPTIONS");
    next(); // make sure we go to the next routes and don't stop here
});

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });   
});

// more routes for our API will happen here
router.route('/GET/notes')

    // get all the notes (accessed at GET http://localhost:8080/api/GET/notes)
    .get( function( req, res ) {
        res.send(dataBase);
    });

router.route('/GET/notes/:id')

    .get( function( req, res ) {
        let noteID = req.params.id;
        let isAbsent = true;
        console.log(noteID);
        let result = dataBase.filter(note => {
            //console.log(note.id == noteID);
            if (note.id == noteID) {
                isAbsent = false;
            }
            return note.id == noteID;
        })[0];
        isAbsent? res.json({ message: `there is not notes with ID ${noteID} in DataBase`, done: false }) 
        : res.send({ result: result, done: true });
    });

router.route('/POST/notes')
    
    .post( function( req, res ) {
        let newNote = req.body.note;
        // console.log(req.body);
        // console.log(newNote);

        if (newNote && newNote !== "") {
            
        let id = `f${(~~(Math.random()*1e8)).toString(16)}`;
        let check = dataBase.filter(obj => obj.id == id);

        while (check.length > 0) {
            id += Math.random() * 10;
        }
        dataBase.push({ id: id, note: newNote });
        }

        (newNote && newNote !== "") ? res.json({ message: "note is added!", done: true }) 
        : res.json({ message: "error: note is empty", done: false });
    } )
router.route('/PUT/notes/:id')

    .put( function ( req, res ) {
        let noteID = req.params.id;
        let changeNote = req.body.note;
        let checkStatus = false;

        //console.log(noteID);
       // console.log(changeNote);
        database = dataBase.map(obj => {

            if (obj.id == noteID) {
                checkStatus = true;
                obj.note = changeNote;
                return obj;
            }
            
            return obj;
        })
        checkStatus? res.json({ message: "note is changed!", done: true})
         : res.json({ message: `there is not notes with ID ${noteID} in DataBase`, done: false });
    });

router.route('/DELETE/notes/:id')

    .delete( function( req, res ) {
        let noteID = req.params.id;
        let checkStatus = false;

        dataBase = dataBase.filter( obj => {
           if (obj.id == noteID) {
               checkStatus = true;
               return;
           }
           return obj;
        });

        checkStatus? res.json({ message: "note is deleted!" }) 
        : res.json({ message: `there is not notes with ID ${noteID} in DataBase` });
    })    

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);
