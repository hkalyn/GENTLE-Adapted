let express = require('express');
let monk = require("monk");
let bodyParser = require('body-parser')
require('dotenv').config();
let bcrypt = require('bcrypt')
/* Content:
Simple node server that can call to MONGODB ATLAS
*/


//Setup
const port = process.env.PORT || 3002;
const location = process.env.URI
// const location = process.env.URI || `ENTER MONGODB USERNAME AND PASSWORD HERE`
// const location // const location = `ENTER MONGODB USERNAME AND PASSWORD HERE`

const local = process.env.LOCAL_DEVELOPMENT || 'true';

//create app
let app = express();
app.use(express.urlencoded({ extended: true }));

// Connect db
if (local === 'true')
{
    console.log('Building for local environment...');
    var db = monk(location, { authSource: 'admin' });
} else
{
    var db = monk(location);
}
let collection = db.collection(process.env.COLLECTION_NAME);


//show all entries in collection
collection.find().then((docs) =>
{
    console.log("Connected to data")
    console.log(docs.length);
})

app.use(express.static(__dirname + "/build"));


//serve react app
app.get('/', (req, res) =>
{
    console.log("SERVING APP")
    res.sendFile(__dirname + "/index.html");
})

/**
 * Sends data to db
 */
app.post("/ajax", (req, res) =>
{
    let ID = req.body.ID;
    let data = req.body.data;
    data = JSON.parse(data);
    collection.find({ ID: ID }).then((doc) =>
    {
        if (doc.length === 0)
        {
            console.log("User does not exist");
            collection.insert({ ID: ID, data: data }).then(() => { res.send("Success") })
        } else
        {
            console.log("User exists. Updating.");
            collection.findOneAndUpdate({ ID: ID },
                { $set: { ID: ID, data: data } }).then(() => { res.send("Success") })
        }
    }
    )
})

function validatePassword(pw)
{

    var error = "Your password must:  "
    var result = true;
    if (!/[A-Z]/.test(pw))
    {
        error += "contain at least one capitol letter, "
        result = false;
    }
    if (!/[a-z]/.test(pw))
    {
        error += "contain at least one lowercase letter, "
        result = false;
    }
    if (!/[0-9]/.test(pw))
    {
        error += "contain at least one number, "
        result = false;
    }
    if (!/[^A-Za-z0-9]/.test(pw))
    {
        error += "contain at least one symbol, "
        result = false;
    }
    if (pw.length < 8)
    {
        error += "be at least 8 characters long."
        result = false;
    }

    var lastChar = error.slice(-2);
    if (lastChar == ', ')
    {
        error = error.slice(0, -2);
        error += "."
    }

    return {
        error: error,
        result: result
    }
}
// My APIs for registering and authenticating a user
app.post("/register", (req, res) =>
{
    let ID = req.body.ID;
    let data = req.body.data;
    let password = req.body.password
    let passwordConfirm = req.body.passwordConfirm

    var valid
    valid = validatePassword(password)
    if (valid.result === false)
    {
        return res.status(500).json({ status: valid.error })
    }
    var password_h = bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
    if (data)
    {
        data = JSON.parse(data);
    }

    collection.find({ ID: ID }).then((doc) =>
    {
        //first failure case, if a user already exists
        if (doc.length !== 0)
        {
            console.log("User already exists.");
            return res.status(500).json({ status: "User exists" })
        }

        //second failure case, if the passwrords dont't match
        //better to double check surver side.
        else if (password !== passwordConfirm)
        {
            console.log("password do not match", password_h)
            return res.status(500).json({ status: "password mismatch" })
        }

        //add a new user
        else
        {
            var newUser = {
                ID: ID,
                password: password_h,
                data: null
            }

            collection.insert(newUser).then(() =>
            {
                return res.status(200).send("Success")
            })
            // collection.insertOne({ ID: req.body.ID }, function (err, user)
            // {

            //     if (bcrypt.compareSync(password, user.password))
            //     {
            //         //password did not match
            //         console.log("Passwords match", user)
            //         return res.status(200).json({ status: "success", ID: ID, password: password_h, data: user.data })
            //     } else
            //     {
            //         // password matched. proceed forward
            //         console.log("password do not match", user, password_h)
            //         console.log("password do not match", password_h)
            //         return res.status(500).json({ status: "password mismatch" })
            //     }
            // });
        }
    })
})

app.post("/login", (req, res) =>
{
    let ID = req.body.ID;
    let data = req.body.data;
    let password = req.body.password
    var password_h = bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
    if (data)
    {
        data = JSON.parse(data);
    }

    collection.find({ ID: ID }).then((doc) =>
    {
        if (doc.length === 0)
        {
            console.log("User does not exist");
            return res.status(500).json({ status: "User Not Found" })
        } else
        {
            collection.findOne({ ID: req.body.ID }, function (err, user)
            {

                if (bcrypt.compareSync(password, user.password))
                {
                    //password did not match
                    console.log("Passwords match", user)
                    return res.status(200).json({ status: "success", ID: ID, password: password_h, data: user.data })
                } else
                {
                    // password matched. proceed forward
                    console.log("password do not match", user, password_h)
                    console.log("password do not match", password_h)
                    return res.status(500).json({ status: "password mismatch" })
                }
            });
        }
    }
    )
})





app.listen(port);
