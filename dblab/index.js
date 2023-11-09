const express = require('express')
const mongoose = require('mongoose')
const port=3000
const app = express()
const routes=require('./routes/routes')
const bodyParser=require('body-parser');

mongoose.connect('mongodb://localhost/loginassignment8', { useNewUrlParser: true });
mongoose.connection
.once("open", () => console.log('Connected'))
.on("error", error => {
console.log("MongoDB Error: " + error);
})
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(function(req, res, next) {
res.header("Access-Control-Allow-Origin", "*");
res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
next();
});
routes(app);

app.listen(port, () => {
console.log(`Example app listening on port ${port}`)
})
