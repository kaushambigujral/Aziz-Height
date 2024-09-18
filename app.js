const express = require('express');
const app = express();
const port = 5200;
const path = require('path');
const favicon = require('serve-favicon');
require('dotenv').config();

const server = app.listen(port, ()=>{
    console.log("Server listening on port " + port);
})

app.set("view engine", "pug"); //telling the server that we're using pug as the template engine
app.set("views", "views"); //all views will be in the views folder
app.use(express.static(path.join(__dirname, "public"))); //serve public files
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico'))); //serve favicon


app.get("/", (req, res, next)=> { 

    var payload = {
        pageTitle : "AZIZ Height!",
        apiKey: process.env.API_KEY
    }

    res.status(200).render("home", payload);
})