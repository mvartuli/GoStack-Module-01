const express = require("express");

const server = express();

//To inform express to read JSON from request body
server.use(express.json());

// query params = ?teste=1
// route params = /usrs/1
// request body = { "name": "Diego", "email": "diego@rocket.com"}

//users vector to simulate data storage
const users = ["Diego", "Claudio", "Victor"];

//Global Middleware - always is called on every requisition
server.use((req, res, next) => {
    //to check the passed time the keyword in the parameter has to be the same in timeEnd call
    console.time("Request");
    console.log(`Method: ${req.method}, URL: ${req.url}`);
    //next() returnes the excution to the called route and come back afterwards
    next();
    //to check the passed time the keyword in the parameter has to be the same in timeEnd call
    console.timeEnd("Request");
});

//Local Middleware to check if the name was passed in the body
function checkUserExist(req, res, next) {
    if (!req.body.name) {
        return res.status(400).json({
            error: "user name is required"
        });
    }
    return next();
}

//Local Middleware to check if the index user passed ind the querystring is valid
function checkQueryString(req, res, next) {
    const user = users[req.params.index];
    if (!user) {
        return res.status(400).json({
            error: "user does not exist"
        });
    }
    req.user = user;
    return next();
}

//route to return all users
server.get("/users", (req, res) => {
    return res.json(users);
});

//route to return one user
//localhost: 3000 / users / 1234
server.get("/users/:index", checkQueryString, (req, res) => {
    //This is used if the user is not added to the req parameter
    //  in the local middleware checkQueryString: const { index } = req.params;
    return res.json(req.user);
});

// route to create one user from request body
server.post("/users", checkUserExist, (req, res) => {
    const { name } = req.body;
    users.push(name);

    return res.json(users);
});

//route to edit one user - it can be assigned how many local middlewares as necessary
server.put("/users/:index", checkQueryString, checkUserExist, (req, res) => {
    const { name } = req.body;
    const { index } = req.params;
    users[index] = name;
    return res.json(users);
});

//route to delete one user
server.delete("/users/:index", checkQueryString, (req, res) => {
    const { index } = req.params;
    users.splice(index, 1);
    return res.send();
});

server.listen(3000);
