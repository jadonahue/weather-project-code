const { Console } = require("console");
const { json } = require("express");
const express = require("express");
const https = require("https"); 
const app = express();
const bodyParser = require("body-parser");
const port = process.env.PORT; // 3000 is what we used for local. For Heroku we need to use process.env.PORT. Which is a dynamic port.
require('dotenv').config() // Import and configure dotenv.

console.log(process.env);

// This allows us to search body of post for information inputted to be retrieved. Such as cityName.
app.use(bodyParser.urlencoded({ extended: true }));


app.get("/", function (reg, res) {
    res.sendFile(__dirname + "/index.html");

});

// Search through the body of post request and get inputted cityName
app.post("/", function (req, res) {

    // Query client for location
    const query = req.body.cityName;

    // Open weather api key. Insert your own api key in .env file.
    const apiKey = process.env.API_KEY;

    // Measuring unit type. Imperial is farenheit, metric is celcius.
    const unit = "imperial";

    // This is openwather's api url. The query is the location
    const url = "https://api.openweathermap.org/data/2.5/weather?q=" + query + "&APPID=" + apiKey + "&units=" + unit;

    https.get(url, function (response) {
        console.log(response.statusCode); // This returns the status code to terminal

        // This fetches the data from external server
        response.on("data", function (data) {
            const weatherData = JSON.parse(data); // This unpacks the data in JSON format and parses into JavaScript object.
            const temp = weatherData.main.temp; // Gets specific temp from weatherData.
            const weatherDescription = weatherData.weather[0].description; // Gets the weather description.
            const icon = weatherData.weather[0].icon; // This is image icon. 
            const imageURL = "https://openweathermap.org/img/wn/" + icon + "@2x.png"; // See: https://openweathermap.org/weather-conditions
            res.write("<p>The weather description is currently: " + weatherDescription + ".</p>"); // Uses the weather Description details from api. 
            res.write("<h1>The temperature in " + query + " is " + temp + " degrees Farenheit.</h1>"); // Query is city location name. Retrieves temp fro api.
            res.write("<img src=" + imageURL + ">"); // This prints location image to page from api.
            res.send(); // res.send the final.
        });
    });
});


app.listen(port || 3000, function () {
    console.log("Server is running on port 3000.");
});